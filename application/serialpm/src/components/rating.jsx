import React, { useState } from "react";

export default function appRating() {
    const [totalRating, setTotalRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingCount, setRatingCount] = useState(0);

    const handleRatingChange = (e) => {
        const rating = parseInt(e.target.value);
        setRatingCount(prevC => prevC + 1);
        setTotalRating(prevT => prevT + rating);
        setAverageRating(totalRating / ratingCount);
    };

    return (
        <div className="rating-component">
            <div className="rate-section">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        value={star}
                        onClick={handleRatingChange}
                        className="rate-buttons"
                    >
                        {star}
                    </button>
                ))}
            </div>
            <p className="avg-rate">Average Rating: {averageRating.toFixed(1)}</p>
            <p className="rate-count">Rating Count: {ratingCount}</p>
        </div>
    );
}