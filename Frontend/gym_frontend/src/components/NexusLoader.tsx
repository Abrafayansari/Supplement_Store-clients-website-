
import React from 'react';
import { motion } from 'framer-motion';

const NexusLoader: React.FC = () => {
    return (
        <div className="w-full min-h-[300px] flex flex-col items-center justify-center p-8">
            <div className="relative">
                {/* Outer Ring */}
                <motion.div
                    className="w-24 h-24 rounded-full border-t-2 border-brand border-r-2 border-brand/30 border-b-2 border-brand/10 border-l-2 border-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Ring */}
                <motion.div
                    className="absolute inset-2 rounded-full border-b-2 border-white border-l-2 border-white/30 border-t-2 border-white/10 border-r-2 border-transparent"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Center Logo Stylized "N" */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <span className="text-2xl font-black text-white italic tracking-tighter">N</span>
                </motion.div>
            </div>

            {/* Loading Text */}
            <motion.div
                className="mt-8 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <span className="text-[10px] font-black text-brand uppercase tracking-[0.4em] animate-pulse">
                    Loading
                </span>
                <div className="w-24 h-[1px] bg-brand/20 relative overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-brand"
                        initial={{ left: "-100%" }}
                        animate={{ left: "100%" }}
                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        style={{ width: "50%" }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default NexusLoader;
