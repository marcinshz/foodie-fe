import './ShoppingLists.scss';
import { useEffect, useState } from 'react';
import { useAppStore } from '../../../store';
import { ShoppingList as ShoppingListType } from '../../../types';
import { getPinnedUserShoppingLists } from '../../../DataService';
import ShoppingList from '../../../components/ShoppingList/ShoppingList';
import { CircularProgress } from '@mui/material';

function ShoppingLists() {
    const [pinnedLists, setPinnedLists] = useState<ShoppingListType[]>([]);
    const [loading, setLoading] = useState(true);
    const authData = useAppStore((state) => state.authData);

    const loadPinnedLists = async () => {
        if (!authData) return;
        
        setLoading(true);
        try {
            const lists = await getPinnedUserShoppingLists(authData.user.id);
            setPinnedLists(lists);
        } catch (error) {
            console.error('Failed to load pinned shopping lists:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPinnedLists();
    }, [authData]);

    if (loading) {
        return (
            <div className="shopping-lists">
                <div className="shopping-lists__loading">
                    <CircularProgress size={60} sx={{ color: '#757bc8' }} />
                    <p>Loading your pinned shopping lists...</p>
                </div>
            </div>
        );
    }

    if (pinnedLists.length === 0) {
        return (
            <div className="shopping-lists">
                <div className="shopping-lists__empty">
                    <h2>No Pinned Shopping Lists</h2>
                    <p>
                        Pin shopping lists from your meal plans to keep them here for easy access.
                    </p>
                    <p className="shopping-lists__empty__hint">
                        Go to a meal plan and click the pin icon on any shopping list to add it here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="shopping-lists">
            <div className="shopping-lists__header">
                <h1>Pinned Shopping Lists</h1>
                <p>Your saved shopping lists from meal plans</p>
            </div>
            
            <div className="shopping-lists__grid">
                {pinnedLists.map((list, index) => (
                    <ShoppingList
                        key={list.id || index}
                        shoppingList={list}
                        listNumber={index + 1}
                        totalLists={pinnedLists.length}
                        onPinChange={loadPinnedLists}
                    />
                ))}
            </div>
        </div>
    );
}

export default ShoppingLists;

