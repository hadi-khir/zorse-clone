import React, { useState, useEffect } from 'react';

interface LeaderboardEntry {
    username: string;
    reveals: number;
    solved: boolean;
    puzzleDate: Date;
}

interface LeaderboardProps {
    puzzleDate: Date;
}

const Leaderboard = ({ puzzleDate }: LeaderboardProps) => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(`/api/leaderboard?date=${puzzleDate.toISOString()}`);
                const data = await response.json();
                setEntries(data);
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [puzzleDate]);

    if (loading) return <div>Loading leaderboard...</div>;

    return (
        <div className="w-full max-w-md mx-auto mt-4">
            <h3 className="text-lg font-semibold mb-4">Today's Leaderboard</h3>
            <div className="rounded-lg shadow">
                {entries.length === 0 ? (
                    <p className="p-4 text-center">No entries yet</p>
                ) : (
                    <div className="divide-y">
                        {entries
                            .sort((a, b) => a.reveals - b.reveals)
                            .map((entry, index) => (
                                <div key={index} className="flex justify-between p-4">
                                    <span className="font-medium">{entry.username}</span>
                                    <span>{entry.solved ? "Solved" : "Not Solved"}</span>
                                    <span>{entry.reveals} reveals</span>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard; 