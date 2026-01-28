
import React, { createContext, useContext, useState, useCallback } from 'react';
import NexusLoader from '../components/NexusLoader';

interface LoaderContextType {
    showLoader: () => void;
    hideLoader: () => void;
    isLoading: boolean;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loadingCount, setLoadingCount] = useState(0);

    const showLoader = useCallback(() => setLoadingCount(prev => prev + 1), []);
    const hideLoader = useCallback(() => setLoadingCount(prev => Math.max(0, prev - 1)), []);

    const isLoading = loadingCount > 0;

    return (
        <LoaderContext.Provider value={{ showLoader, hideLoader, isLoading }}>
            {isLoading && <NexusLoader />}
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoader = () => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoader must be used within a LoaderProvider');
    }
    return context;
};
