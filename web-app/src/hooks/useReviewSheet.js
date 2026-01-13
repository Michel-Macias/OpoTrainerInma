import { useState, useEffect } from 'react';

const STORAGE_KEY = 'opotrainer_sheets';

export function useReviewSheet(topicId) {
    const [sheetData, setSheetData] = useState(() => {
        try {
            const allSheets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            return allSheets[topicId] || {
                concepts: [{ term: '', def: '' }],
                deadlines: [{ action: '', time: '', notes: '' }],
                kitchen: { temp: '', allergens: '', appcc: '' },
                notes: ''
            };
        } catch (e) {
            console.error('Error loading sheets:', e);
            return {
                concepts: [{ term: '', def: '' }],
                deadlines: [{ action: '', time: '', notes: '' }],
                kitchen: { temp: '', allergens: '', appcc: '' },
                notes: ''
            };
        }
    });

    const saveSheet = (newData) => {
        try {
            const allSheets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            allSheets[topicId] = { ...newData, lastUpdated: new Date().toISOString() };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allSheets));
            setSheetData(newData);
        } catch (e) {
            console.error('Error saving sheet:', e);
        }
    };

    return { sheetData, saveSheet };
}
