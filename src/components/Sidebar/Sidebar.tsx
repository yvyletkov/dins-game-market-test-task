import React from 'react';
import {BuyStatus, Purchase, UserShortInfo} from '../../data/types';
import {SidebarUserName} from './SidebarUserName';
import {SidebarActions} from './SidebarActions';
import {SidebarStatus} from './SidebarStatus';
import {CartItem} from './CartItem';
import './Sidebar.css';

interface CartProps {
    purchases: Purchase[];
    friends: UserShortInfo[];
    buyStatus: BuyStatus;
    onPurchaseChange: (purchase: Purchase) => void,
    onPurchaseDelete: (purchase: Purchase) => void,
    onBuy?: () => void,
    className?: string;
}

export function Sidebar({purchases, friends, buyStatus, onPurchaseChange, onPurchaseDelete, onBuy, className}: CartProps) {
    return (
        <div className={`sidebar ${className || ''}`}>
            <SidebarUserName />
            {purchases.map((purchase) => (
                <CartItem
                    purchase={purchase}
                    friends={friends}
                    buyStatus={buyStatus}
                    onChange={onPurchaseChange}
                    onDelete={onPurchaseDelete}
                    key={purchase.game.id}
                />
            ))}
            <SidebarActions purchases={purchases} buyStatus={buyStatus} onBuy={onBuy} />
            <SidebarStatus buyStatus={buyStatus} />
        </div>
    );
}
