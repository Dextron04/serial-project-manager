import { motion } from "framer-motion";

export default function TeamMember({ name, role, description, imageUrl }) {
    return (
        <motion.div whileHover={{ scale: 1.05, rotate: 1 }} transition={{ type: "spring", stiffness: 300 }}>
            <div className="overflow-hidden bg-gray-800/30 backdrop-blur-md shadow-xl border border-gray-700 rounded-lg">
                <div className="p-0">
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                    <img
                        src={imageUrl || "/placeholder.svg"}
                        alt={name}
                        width={400}
                        height={400}
                        className="w-full h-64 object-cover"
                    />
                </div>
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-1 text-gray-100">{name}</h2>
                    <h3 className="text-sm mb-3 text-blue-400">{role}</h3>
                    <p className="text-sm text-gray-300">{description}</p>
                </div>
            </div>
        </motion.div>
    );
}
