const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const http = require("http");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
app.use(cors());
app.use(express.json());

// ======== SOCKET.IO CONFIG ========

const activeUsers = {};

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("register", (userID) => {
    socket.userID = userID;
    socket.join(userID);
    activeUsers[userID] = socket;
    // console.log("User registered", activeUsers);
    // console.log("User registered", userID);
  });

  socket.on("disconnect", () => {
    if (socket.userID) {
      delete activeUsers[socket.userID];
      console.log("User disconnected", socket.userID);
    }
  });

  socket.on("send-notification", (data) => {
    io.to(data.toUser).emit("receive-notification", data);
    // console.log("Notification sent to", data.toUser);
  });
});

// ======== DATABASE CONNECTION ========

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) console.error("DB connection failed:", err);
  else console.log("DB connected successfully.");
});

// ======== MULTER CONFIG ========

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ======== JWT TOKEN GENERATION ========

//TODO: Need to regenerate the token after the user joins an org
//  This is null when the user signs up for a new org
// Need to regenerate the token after the user joins an org
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.user_id,
      email: user.email,
      organization_id: user.organization_id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );
};

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    console.log("No authorization header found");
    return res.status(401).json({ error: "Access denied - No token provided" });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(" ")[1];

  if (!token) {
    console.log("No token found in authorization header");
    return res
      .status(401)
      .json({ error: "Access denied - Invalid token format" });
  }

  console.log("Verifying token...");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(403).json({ error: "Invalid token" });
    }
    console.log("Token verified successfully for user:", user);
    req.user = user;
    // console.log("This is the req", req.user);
    next();
  });
};

// ======== API ENDPOINTS ========

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the SerialPM API" });
});

// ======== ORGANIZATION ENDPOINTS ========

// GET: Get all organizations
app.get("/api/organizations", authenticateToken, (req, res) => {
  db.query("SELECT * FROM Organization", (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

// PUT: Join organization
app.put("/api/organizations/join", authenticateToken, (req, res) => {
  const { invite_key, user_id } = req.body;

  if (!invite_key || !user_id) {
    return res
      .status(400)
      .json({ error: "invite_key and user_id are required" });
  }

  db.query(
    "SELECT organization_id, name FROM `Organization` WHERE invite_key = ?",
    [invite_key],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ error: "Invalid invite key" });

      const organization = results[0];

      // Update user's organization_id
      db.query(
        "UPDATE User SET organization_id = ?, role = 'team_member' WHERE user_id = ?",
        [organization.organization_id, user_id],
        (err, results) => {
          if (err) return res.status(500).json({ error: err.message });

          // Fetch updated user data
          db.query(
            "SELECT * FROM User WHERE user_id = ?",
            [user_id],
            (err, userResults) => {
              if (err) return res.status(500).json({ error: err.message });
              if (userResults.length === 0)
                return res.status(404).json({ error: "User not found" });

              const updatedUser = userResults[0];
              const newToken = generateToken(updatedUser);

              res.status(200).json({
                message: "Organization joined successfully",
                organization: organization,
                token: newToken,
              });
            }
          );
        }
      );
    }
  );
});

// GET: Get organization by ID
app.get("/api/organizations/:organizationId", authenticateToken, (req, res) => {
  const { organizationId } = req.params;

  db.query(
    "SELECT * FROM Organization WHERE organization_id = ?",
    [organizationId],
    (err, results) => {
      if (err) {
        console.error("Error fetching organization:", err);
        return res
          .status(500)
          .json({ error: "Failed to fetch organization data" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Organization not found" });
      }

      res.json(results[0]);
    }
  );
});

// PUT: Update organization
app.put("/api/organizations/:organizationId", authenticateToken, (req, res) => {
  const { organizationId } = req.params;
  const { title, description, admins, teams, users } = req.body;

  const updateQuery = `
    UPDATE Organization
    SET title = ?, description = ?
    WHERE organization_id = ?
  `;

  db.query(
    updateQuery,
    [title, description, organizationId],
    (err, results) => {
      if (err) {
        console.error("Error updating organization:", err);
        return res.status(500).json({ error: "Failed to update organization" });
      }

      res.json({ message: "Organization updated successfully" });
    }
  );
});

// GET: Get all projects in an organization
app.get(
  "/api/organizations/:organizationId/projects",
  authenticateToken,
  async (req, res) => {
    const { organizationId } = req.params;

    try {
      const [results] = await db
        .promise()
        .query("SELECT * FROM Project WHERE organization_id = ?", [
          organizationId,
        ]);
      console.log("Projects:", results);
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET: Search or fetch all users
app.get("/api/users", authenticateToken, (req, res) => {
  const { query, offset = 0, limit = 10 } = req.query;

  let sql = `
    SELECT user_id, name AS username, email,
      CASE
        WHEN name LIKE ? THEN 1  -- Exact match at the start
        WHEN name LIKE ? THEN 2  -- Partial match anywhere
        ELSE 3
      END AS relevance
    FROM User
  `;
  const params = [];

  if (query) {
    sql += `
      WHERE name LIKE ? OR email LIKE ?
      ORDER BY relevance ASC, name ASC
      LIMIT ? OFFSET ?
    `;
    const searchPatternStart = `${query}%`;
    const searchPatternAnywhere = `%${query}%`;
    params.push(
      searchPatternStart,
      searchPatternAnywhere,
      searchPatternAnywhere,
      searchPatternAnywhere,
      parseInt(limit),
      parseInt(offset)
    );
  } else {
    sql += "ORDER BY name ASC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));
  }

  console.log("Executing SQL:", sql);
  console.log("With parameters:", params);

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Failed to fetch users" });
    }

    res.json(results);
  });
});

// GET: Get a user by user_id
app.get("/api/users/:user_id", authenticateToken, (req, res) => {
  const { user_id } = req.params;
  db.query(
    "SELECT * FROM User WHERE user_id = ?",
    [user_id],
    (err, results) => {
      if (err) res.status(500).json({ error: err.message });
      else if (results.length === 0)
        res.status(404).json({ error: "User not found" });
      else res.json(results[0]);
    }
  );
});

// GET: Get current user details
// TODO: Implement this endpoint
// app.get("/api/users/me", authenticateToken, (req, res) => {
//   const userId = req.user.id; // Extract user ID from the token

//   db.query(
//     "SELECT user_id, name, email, role, account_status, organization_id FROM User WHERE user_id = ?",
//     [userId],
//     (err, results) => {
//       if (err) {
//         console.error("Error fetching user data:", err);
//         return res.status(500).json({ error: "Failed to fetch user data" });
//       }

//       if (results.length === 0) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       res.json(results[0]);
//     }
//   );
// });

// POST: Add a new user
app.post("/api/users/add", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Request Body:", req.body);

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "client"; // Default role
    const account_status = "active"; // Default account status
    const organization_id = null;

    const [result] = await db.promise().query(
      `INSERT INTO User (name, email, password, role, account_status, organization_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, role, account_status, organization_id]
    );

    const [rows] = await db
      .promise()
      .query(
        "SELECT user_id, name, email, role, account_status FROM User WHERE user_id = ?",
        [result.insertId]
      );

    // Send welcome notification to the new user
    console.log("Sending welcome notification to the new user");
    console.log(result.insertId.toString());
    io.to(result.insertId.toString()).emit("receive-notification", {
      message: "Welcome to SerialPM!",
      type: "success",
      message: "Welcome to SerialPM! You are now connected to the server.",
    });

    res.status(201).json({
      message: "User added successfully",
      user: rows[0],
      token: generateToken(rows[0]),
    });
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST: Login user
app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM User WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const user = results[0];

      // Check if the password matches
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Fetch organization details
      db.query(
        "SELECT * FROM Organization WHERE organization_id = ?",
        [user.organization_id],
        (orgErr, orgResults) => {
          if (orgErr) {
            console.error("Error fetching organization:", orgErr);
            return res
              .status(500)
              .json({ error: "Failed to fetch organization details" });
          }

          const organization = orgResults[0] || null;

          // Generate token and include organization details
          const token = generateToken(user);
          res.json({
            token,
            user: {
              id: user.user_id,
              user_id: user.user_id,
              name: user.name,
              email: user.email,
              role: user.role,
              account_status: user.account_status,
              organization_name: organization?.name || null,
              organization_id: user.organization_id || null,
              admin_email: organization?.admin_email || null,
            },
          });
        }
      );
    }
  );
});

// POST: User logout endpoint
app.post("/api/users/logout", authenticateToken, (req, res) => {
  try {
    const { user_id } = req.body;
    console.log("Logout request received for user:", user_id);

    if (!user_id) {
      console.log("No user_id provided in request body");
      return res.status(400).json({ error: "User ID is required" });
    }

    // Remove user from active users
    if (activeUsers[user_id]) {
      console.log("Removing user from active users:", user_id);
      delete activeUsers[user_id];
    } else {
      console.log("User not found in active users:", user_id);
    }

    console.log("Logout successful for user:", user_id);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal server error during logout" });
  }
});

app.post(
  "/api/users/:user_id/profile-picture",
  authenticateToken,
  upload.single("profilePicture"),
  (req, res) => {
    const { user_id } = req.params;
    const profilePicture = `/uploads/${req.file.filename}`;

    db.query(
      "UPDATE User SET profilePicture = ? WHERE user_id = ?",
      [profilePicture, user_id],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ profilePicture });
      }
    );
  }
);

// GET: Get organization ID for a user through user_id
app.post("/api/users/get-organization", authenticateToken, (req, res) => {
  const { user_id } = req.body;
  // console.log("This is the req", req.user);

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  db.query(
    "SELECT organization_id FROM User WHERE user_id = ?",
    [user_id],
    (err, userResults) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (userResults.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!userResults[0].organization_id) {
        return res
          .status(404)
          .json({ error: "No organization found for this user" });
      }

      // Get complete organization data
      db.query(
        `SELECT o.*, u.name as admin_name, u.email as admin_email 
       FROM Organization o 
       LEFT JOIN User u ON o.admin_id = u.user_id 
       WHERE o.organization_id = ?`,
        [userResults[0].organization_id],
        (err, orgResults) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          if (orgResults.length === 0) {
            return res.status(404).json({ error: "Organization not found" });
          }

          // Get all users in the organization
          db.query(
            `SELECT user_id, name, email, role, profile_picture 
           FROM User 
           WHERE organization_id = ?`,
            [userResults[0].organization_id],
            (err, membersResults) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }

              // Combine all the data
              const response = {
                ...orgResults[0],
                members: membersResults,
              };

              res.json(response);
            }
          );
        }
      );
    }
  );
});

// ======== PROJECT ENDPOINTS ========

// GET: Search projects endpoint
app.get("/api/projects/search", (req, res) => {
  console.log("Search endpoint hit with query:", req.query);
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Search query is required" });
  }

  const searchQuery = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.status,
      p.start_date,
      p.end_date,
      p.owner,
      p.budget,
      p.milestones,
      u.name as owner_name
    FROM Project p
    LEFT JOIN User u ON p.owner = u.user_id
    WHERE 
      p.title LIKE ? OR 
      p.description LIKE ? OR 
      p.status LIKE ? OR
      p.milestones LIKE ? OR
      u.name LIKE ?
    LIMIT 10
  `;

  const searchPattern = `%${q}%`;
  console.log("Executing search with pattern:", searchPattern);

  db.query(
    searchQuery,
    [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern],
    (err, results) => {
      if (err) {
        console.error("Search error:", err);
        return res.status(500).json({ error: "Error performing search" });
      }

      console.log("Search results:", results);
      res.json(results);
    }
  );
});

// GET: Get all projects
app.get("/api/projects", (req, res) => {
  db.query("SELECT * FROM Project", (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

// POST: Create a new project
app.post("/api/projects", authenticateToken, (req, res) => {
  const {
    title,
    description,
    start_date,
    end_date,
    status,
    owner,
    budget,
    milestones,
  } = req.body;

  const org_id = req.user.organization_id; // Extract organization ID from the token

  if (!title || !start_date || !status) {
    return res
      .status(400)
      .json({ error: "Title, start_date, and status are required" });
  }

  const query = `
    INSERT INTO Project (title, description, start_date, end_date, status, owner, budget, milestones, organization_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    title,
    description || null,
    start_date,
    end_date || null,
    status,
    owner || null,
    budget || null,
    milestones || null,
    org_id,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error creating project:", err);
      return res.status(500).json({ error: "Failed to create project" });
    }

    res.status(201).json({
      message: "Project created successfully",
      project_id: result.insertId,
    });
  });
});

// GET: Get all tasks or tasks by project_id or tags
app.get("/api/tasks", authenticateToken, (req, res) => {
  const { project_id, tags } = req.query;

  let query = "SELECT * FROM Task";
  const queryParams = [];

  if (project_id) {
    query += " WHERE project_id = ?";
    queryParams.push(project_id);
  }

  if (tags) {
    const tagList = tags.split(",").map((tag) => tag.trim());
    const tagConditions = tagList
      .map(() => "FIND_IN_SET(?, tags)")
      .join(" OR ");
    query += project_id ? ` AND (${tagConditions})` : ` WHERE ${tagConditions}`;
    queryParams.push(...tagList);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }

    res.json(results);
  });
});

// POST: Create a new task
app.post("/api/tasks", authenticateToken, (req, res) => {
  const {
    title,
    description,
    priority,
    due_date,
    project_id,
    assigned_user,
    tags,
  } = req.body;

  if (!title || !project_id) {
    return res.status(400).json({ error: "Title and project_id are required" });
  }

  const query = `
    INSERT INTO Task (title, description, priority, due_date, project_id, assigned_user, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    title,
    description,
    priority,
    due_date,
    project_id,
    assigned_user || null,
    tags || null, // Add tags to the query
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error creating task:", err);
      return res.status(500).json({ error: "Failed to create task" });
    }

    res.status(201).json({ task_id: result.insertId, ...req.body });
  });
});

// GET: Fetch task details by task_id
app.get("/api/tasks/:task_id", authenticateToken, (req, res) => {
  const { task_id } = req.params;

  const query = `
    SELECT 
      t.task_id,
      t.title,
      t.description,
      t.priority,
      t.due_date,
      t.project_id,
      t.status,
      t.created_date,
      t.updated_date,
      u.name AS assigned_user_name,
      u.email AS assigned_user_email
    FROM Task t
    LEFT JOIN User u ON t.assigned_user = u.user_id
    WHERE t.task_id = ?
  `;

  db.query(query, [task_id], (err, results) => {
    if (err) {
      console.error("Error fetching task details:", err);
      return res.status(500).json({ error: "Failed to fetch task details" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const task = results[0];

    // Format dates
    task.created_date = task.created_date
      ? new Date(task.created_date).toISOString()
      : null;
    task.updated_date = task.updated_date
      ? new Date(task.updated_date).toISOString()
      : null;

    console.log("Formatted task:", task); // Log the formatted task
    res.json(task);
  });
});

// PUT: Update task status
app.put("/api/tasks/:task_id", authenticateToken, (req, res) => {
  const { task_id } = req.params;
  const { status } = req.body;

  const query = `
    UPDATE Task
    SET status = ?
    WHERE task_id = ?
  `;

  db.query(query, [status, task_id], (err, result) => {
    if (err) {
      console.error("Error updating task status:", err);
      return res.status(500).json({ error: "Failed to update task status" });
    }

    res.json({ task_id, status });
  });
});

// PUT: Update a task
app.put("/api/tasks/:task_id", authenticateToken, (req, res) => {
  const { task_id } = req.params;
  const { title, description, priority, due_date, status, tags } = req.body;

  // Validate required fields
  if (!title || !priority || !status) {
    return res
      .status(400)
      .json({ error: "Title, priority, and status are required" });
  }

  const query = `
    UPDATE Task
    SET 
      title = ?,
      description = ?,
      priority = ?,
      due_date = ?,
      status = ?,
      tags = ?
    WHERE task_id = ?
  `;
  const values = [
    title.trim(),
    description ? description.trim() : null,
    priority,
    due_date || null,
    status,
    tags || null,
    task_id,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating task:", err);
      return res.status(500).json({ error: "Failed to update task" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Fetch and return the updated task
    const fetchQuery = `
      SELECT 
        t.task_id,
        t.title,
        t.description,
        t.priority,
        t.due_date,
        t.status,
        t.tags
      FROM Task t
      WHERE t.task_id = ?
    `;
    db.query(fetchQuery, [task_id], (fetchErr, fetchResults) => {
      if (fetchErr) {
        console.error("Error fetching updated task:", fetchErr);
        return res.status(500).json({ error: "Failed to fetch updated task" });
      }

      res.json(fetchResults[0]);
    });
  });
});

// DELETE: Delete a task by task_id
app.delete("/api/tasks/:task_id", authenticateToken, (req, res) => {
  const { task_id } = req.params;

  const query = `
    DELETE FROM Task
    WHERE task_id = ?
  `;

  db.query(query, [task_id], (err, result) => {
    if (err) {
      console.error("Error deleting task:", err);
      return res.status(500).json({ error: "Failed to delete task" });
    }

    res.json({ message: "Task deleted successfully" });
  });
});

// GET: Get a project by project_id
app.get("/api/projects/:project_id", (req, res) => {
  const { project_id } = req.params;
  db.query(
    "SELECT * FROM Project WHERE project_id = ?",
    [project_id],
    (err, results) => {
      if (err) res.status(500).json({ error: err.message });
      else if (results.length === 0)
        res.status(404).json({ error: "Project not found" });
      else res.json(results[0]);
    }
  );
});

// PUT: Update project settings
app.put("/api/projects/:project_id", (req, res) => {
  const { project_id } = req.params;
  const { title, description, status, budget, milestones, end_date } = req.body;

  console.log("Updating project:", project_id);
  console.log("Update data:", req.body);

  // Validate required fields
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Project title is required" });
  }

  // Validate status
  const validStatuses = ["active", "completed", "on hold"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid project status" });
  }

  // Validate budget if provided
  if (budget !== null && budget !== undefined) {
    const budgetNum = parseFloat(budget);
    if (isNaN(budgetNum) || budgetNum < 0) {
      return res
        .status(400)
        .json({ error: "Budget must be a positive number" });
    }
  }

  // Validate end date if provided
  if (end_date) {
    const endDateObj = new Date(end_date);
    if (isNaN(endDateObj.getTime())) {
      return res.status(400).json({ error: "Invalid end date format" });
    }
  }

  // First check if project exists
  db.query(
    "SELECT * FROM Project WHERE project_id = ?",
    [project_id],
    (err, results) => {
      if (err) {
        console.error("Error checking project:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Update project
      const updateQuery = `
      UPDATE Project 
      SET 
        title = ?,
        description = ?,
        status = ?,
        budget = ?,
        milestones = ?,
        end_date = ?
      WHERE project_id = ?
    `;

      db.query(
        updateQuery,
        [
          title.trim(),
          description ? description.trim() : null,
          status,
          budget || null,
          milestones ? milestones.trim() : null,
          end_date || null,
          project_id,
        ],
        (err, results) => {
          if (err) {
            console.error("Error updating project:", err);
            return res.status(500).json({ error: "Failed to update project" });
          }

          // Fetch and return the updated project
          db.query(
            `SELECT 
            p.*,
            u.name as owner_name
          FROM Project p
          LEFT JOIN User u ON p.owner = u.user_id
          WHERE p.project_id = ?`,
            [project_id],
            (err, results) => {
              if (err) {
                console.error("Error fetching updated project:", err);
                return res
                  .status(500)
                  .json({ error: "Failed to fetch updated project" });
              }

              // Format the response
              const project = results[0];
              const response = {
                ...project,
                budget: project.budget ? parseFloat(project.budget) : null,
                end_date: project.end_date
                  ? new Date(project.end_date).toISOString().split("T")[0]
                  : null,
              };

              res.json(response);
            }
          );
        }
      );
    }
  );
});

// GET: Get all projects for the user's organization
app.get("/api/organization/projects", authenticateToken, (req, res) => {
  const { organization_id } = req.user; // Extract organization_id from the token

  if (!organization_id) {
    return res.status(400).json({ error: "Organization ID is required" });
  }

  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.start_date,
      p.end_date,
      p.status,
      p.owner,
      p.budget,
      p.milestones,
      u.name as owner_name
    FROM team2_project.Project p
    LEFT JOIN team2_project.User u ON p.owner = u.user_id
    WHERE p.org_id = ?
  `;

  db.query(query, [organization_id], (err, results) => {
    if (err) {
      console.error("Error fetching projects:", err);
      return res.status(500).json({ error: "Failed to fetch projects" });
    }

    res.json(results);
  });
});

// GET: Get all users in the user's organization
app.get("/api/organization/users", authenticateToken, (req, res) => {
  const { organization_id } = req.user;
  console.log("req.user", req.user);

  if (!organization_id) {
    console.error("Missing organization_id in token");
    return res.status(400).json({ error: "Organization ID is required" });
  }

  const query = `
    SELECT user_id, name, email, role, profile_picture, account_status
    FROM User
    WHERE organization_id = ?
  `;

  db.query(query, [organization_id], (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Failed to fetch users" });
    }

    res.json(results);
  });
});

// POST: Organization signup endpoint
app.post("/api/orgs/signup", authenticateToken, async (req, res) => {
  const { name, admin_name, admin_email, user_id, city, state, zip, country } =
    req.body;

  console.log(req.body);
  console.log(user_id);
  console.log(admin_email);
  console.log("This is the req", req.user);
  // Validate required fields
  if (
    !name ||
    !admin_name ||
    !admin_email ||
    !user_id ||
    !city ||
    !state ||
    !zip ||
    !country
  ) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  // Validate ZIP code format (basic US format)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(zip)) {
    return res.status(400).json({
      error: "Invalid ZIP code format",
    });
  }

  // Generate a unique invite key
  const inviteKey = uuidv4();

  // Start a transaction
  db.beginTransaction(async (err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({ error: "Failed to start transaction" });
    }

    try {
      // Check if user exists and matches the email
      const [existingUsers] = await db
        .promise()
        .query("SELECT * FROM User WHERE user_id = ?", [user_id]);

      if (existingUsers.length === 0) {
        await db.promise().rollback();
        return res.status(404).json({
          error: "User not found or email does not match",
        });
      }

      // Create the organization with invite key
      const [orgResult] = await db.promise().query(
        `INSERT INTO Organization (name, admin_name, admin_email, city, state, zip, country, invite_key, admin_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          admin_name,
          admin_email,
          city,
          state,
          zip,
          country,
          inviteKey,
          user_id,
        ]
      );

      const orgId = orgResult.insertId;
      console.log("This is the orgId", orgId);

      // Update the user's role to admin and set organization_id
      await db.promise().query(
        `UPDATE User 
         SET role = 'admin', organization_id = ?
         WHERE user_id = ?`,
        [orgId, user_id]
      );

      // Fetch updated user data
      const [updatedUserResults] = await db
        .promise()
        .query("SELECT * FROM User WHERE user_id = ?", [user_id]);

      if (updatedUserResults.length === 0) {
        await db.promise().rollback();
        return res.status(404).json({ error: "User not found after update" });
      }

      const updatedUser = updatedUserResults[0];
      const newToken = generateToken(updatedUser);

      // Commit the transaction
      await db.promise().commit();

      res.status(201).json({
        message: "Organization created and user role updated successfully",
        organization_id: orgId,
        invite_key: inviteKey,
        token: newToken,
      });
    } catch (error) {
      // Rollback the transaction on error
      await db.promise().rollback();
      console.error("Error during organization signup:", error);
      res.status(500).json({
        error: "Failed to create organization and update user role",
      });
    }
  });
});

// Function to check and add required columns if they don't exist
const checkAndAddColumns = async () => {
  try {
    // Check and add invite_key column
    const [inviteKeyColumns] = await db
      .promise()
      .query("SHOW COLUMNS FROM Organization LIKE 'invite_key'");
    if (inviteKeyColumns.length === 0) {
      await db
        .promise()
        .query(
          "ALTER TABLE Organization ADD COLUMN invite_key VARCHAR(36) UNIQUE"
        );
      console.log("Added invite_key column to Organization table");
    }

    // Check and add admin_id column
    const [adminIdColumns] = await db
      .promise()
      .query("SHOW COLUMNS FROM Organization LIKE 'admin_id'");
    if (adminIdColumns.length === 0) {
      await db
        .promise()
        .query(
          "ALTER TABLE Organization ADD COLUMN admin_id INT, ADD FOREIGN KEY (admin_id) REFERENCES User(user_id)"
        );
      console.log("Added admin_id column to Organization table");
    }
  } catch (error) {
    console.error("Error checking/adding columns:", error);
  }
};

// Call the function when the server starts
checkAndAddColumns();

// ======== SOCKET.IO API ========

app.post("/api/socket/send-notification", (req, res) => {
  const { toUser, message, type } = req.body;
  io.to(toUser).emit("receive-notification", { message, type });
  res.status(200).json({ message: "Notification sent successfully" });
});

// POST: Send a message
app.post("/api/socket/send-message", authenticateToken, async (req, res) => {
  const { toUser, fromUser, message } = req.body;

  if (!toUser || !fromUser || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Get sender's name for the notification
    const [senderResult] = await db
      .promise()
      .query("SELECT name FROM User WHERE user_id = ?", [fromUser]);
    const senderName = senderResult[0]?.name || "Someone";

    // Insert message into database
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO Messages (sender_id, receiver_id, message, timestamp) VALUES (?, ?, ?, ?)",
        [fromUser, toUser, message, new Date()]
      );

    const messageData = {
      id: result.insertId,
      fromUser,
      message,
      timestamp: new Date().toISOString()
    };

    // Send message to receiver if they are online
    if (activeUsers[toUser]) {
      activeUsers[toUser].emit("receive-message", messageData);
    }

    // Send notification to receiver
    if (activeUsers[toUser]) {
      activeUsers[toUser].emit("receive-notification", {
        type: "message",
        title: "New Message",
        message: `${senderName} sent you a message`,
        data: messageData,
        timestamp: new Date().toISOString(),
      });
    }

    res.status(200).json({ message: "Message sent successfully", data: messageData });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// POST: Get all messages between two users
app.post("/api/socket/get-messages", authenticateToken, async (req, res) => {
  const { toUser, fromUser } = req.body;

  if (!toUser || !fromUser) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const messages = await db
    .promise()
    .query(
      "SELECT * FROM Messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
      [fromUser, toUser, toUser, fromUser]
    );

  console.log(messages[0]);

  res.status(200).json(messages[0]);
});

server.listen(9000, () => {
  console.log("Backend API server running on port 9000");
});
