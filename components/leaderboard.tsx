"use client"

import { LeaderboardEntry } from '@/lib/data';

interface LeaderboardProps {

    leaderboardData: LeaderboardEntry[];
  
  }

const Leaderboard = ({ leaderboardData }: LeaderboardProps) => {

    return (
        <div className="w-11/12 max-w-md mx-auto mt-4">
            <h3 className="text-lg font-semibold mb-4">{`Today's Leaderboard`}</h3>
            <div className="rounded-lg shadow">
                {leaderboardData.length === 0 ? (
                    <p className="p-4 text-center">No entries yet</p>
                ) : (
                    <div className="divide-y">
                        {leaderboardData
                            .sort((a, b) => a.reveals - b.reveals)
                            .map((entry, index) => (
                                <div key={index} className="flex justify-between p-4">
                                    <span className="font-medium w-2/6">{entry.username}</span>
                                    <span className='w-2/6'>{entry.solved ? "✅" : "❌"}</span>
                                    <span className='w-2/6'>{entry.reveals} reveals</span>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard; 