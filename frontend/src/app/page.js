'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import CodeAnalyzer from '@/components/CodeAnalyzer';
import { analyzeCode } from '@/api/axios';

export default function Home() {
    const [code, setCode] = useState('');
    const [visualizationData, setVisualizationData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSwitched, setIsSwitched] = useState(true);
    const router = useRouter();

    const handleAnalyze = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const data = await analyzeCode(code);
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to analyze code');
            }

            setVisualizationData(data.analysis);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSwitch = () => {
        setIsSwitched(!isSwitched);
        router.push('/debug');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Code Visualization</h1>
                <button 
                    className={`${styles.switchButton} ${isSwitched ? styles.switched : ''}`}
                    onClick={handleSwitch}
                    aria-label="Switch to Debug Mode"
                />
            </div>

            <div className={styles.editor}>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter your code here..."
                    className={styles.codeInput}
                />
                <button 
                    onClick={handleAnalyze}
                    disabled={loading || !code}
                    className={styles.analyzeButton}
                >
                    {loading ? 'Analyzing...' : 'Analyze Code'}
                </button>
            </div>

            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}

            {visualizationData && (
                <div className={styles.visualization}>
                    <h2>Visualization</h2>
                    <CodeAnalyzer />
                </div>
            )}
        </div>
    );
}
