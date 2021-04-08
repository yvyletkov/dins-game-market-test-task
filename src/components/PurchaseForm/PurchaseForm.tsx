import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {BuyStatus, Purchase, UserShortInfo, UserPurchaseAccess} from '../../data/types';
import {CurrentUserContext} from "../Context";
import {PurchaseCheckbox} from "../Common/PurchaseCheckbox";
import {TextInput} from "../Common/TextInput";
import './PurchaseForm.css'
import {Button} from "../Common/Button";
import {EMAIL_REGEX} from "../../data/constants"

interface PurchaseFormProps {
    value: Purchase;
    friends: UserShortInfo[];
    onChange: (value: Purchase) => void;
    buyStatus?: BuyStatus;
}

export function PurchaseForm({value, friends, buyStatus, onChange}: PurchaseFormProps) {

    const currentUser: UserShortInfo | undefined = useContext(CurrentUserContext);

    const [textInputValue, setTextInputValue] = useState<string>('')
    const [emailInputError, setEmailInputError] = useState<boolean>(false)
    const [showTextInput, setShowTextInput] = useState<boolean>(false)
    const [hasRestrictions, setHasRestrictions] = useState<boolean>(false)
    const [userList, setUserList] = useState<UserPurchaseAccess[]>([])

    useMemo(() => {
        if (value.game.restrictions?.minAge) setHasRestrictions(true)
    }, [value])

    useMemo(() => {
        if (currentUser) {
            const userList: UserPurchaseAccess[] = [currentUser, ...friends].map((user) => {
                const data: UserPurchaseAccess = {
                    id: user.id,
                    name: user.name,
                    allowed: true,
                }
                if (value.game.restrictions?.minAge) {
                    if (!user.age) {
                        data.errorReason = 'Cannot be selected unless user\'s age is specified, because the game has age restriction'
                        data.allowed = false
                    } else if (user.age < value.game.restrictions?.minAge) {
                        data.errorReason = 'The person is not allowed to get the game due to age restriction'
                        data.allowed = false
                    }
                }
                return data
            })
            setUserList(userList)
        }
    }, [currentUser, friends])

    const handleBtnClick = useCallback((email: string) => {
        debugger
        let updatedPurchase: Purchase = JSON.parse(JSON.stringify(value))
        if (!updatedPurchase.emails) updatedPurchase.emails = []
        if (EMAIL_REGEX.test(email)) {
            updatedPurchase.emails.push(email)
            setTextInputValue('')
            setEmailInputError(false)
        }
        else setEmailInputError(true)
        onChange(updatedPurchase)
    }, [onChange, value])

    const handleFriendsCheckbox = useCallback((checked: boolean, id: any) => {
        let updatedPurchase: Purchase = JSON.parse(JSON.stringify(value))
        if (checked) {
            if (updatedPurchase.userIds?.length) updatedPurchase.userIds.push(id!)
            else updatedPurchase.userIds = [id!]
        } else updatedPurchase.userIds = updatedPurchase.userIds!.filter(item => item !== id)
        onChange(updatedPurchase)
    }, [onChange, value])

    const handleInviteCheckbox = useCallback((checked: boolean, email: any) => {
        let updatedPurchase: Purchase = JSON.parse(JSON.stringify(value))
        if (checked) {
            if (updatedPurchase.emails?.length) updatedPurchase.emails.push(email!)
            else updatedPurchase.emails = [email!]
        } else updatedPurchase.emails = updatedPurchase.emails!.filter(item => item !== email)
        onChange(updatedPurchase)
    }, [onChange, value])

    const handleAcknowledgeInviteAgeCheckbox = useCallback((checked: boolean) => {
        let updatedPurchase: Purchase = JSON.parse(JSON.stringify(value))
        updatedPurchase.acknowledgeInviteAge = checked;
        onChange(updatedPurchase)
    }, [onChange, value])

    const handleAcknowledgeInviteCheckbox = useCallback((checked: boolean) => {
        let updatedPurchase: Purchase = JSON.parse(JSON.stringify(value))
        updatedPurchase.acknowledgeInvite = checked;
        onChange(updatedPurchase)
    }, [onChange, value])

    return (
        <>
            <p>Buy for:</p>
            {userList.map((user, index) => {
                    return <PurchaseCheckbox key={index}
                                             error={!user.allowed}
                                             errorText={user.errorReason}
                                             id={user.id}
                                             disabled={buyStatus === BuyStatus.inProgress}
                                             checked={value.userIds?.includes(user.id) || false}
                                             onChange={handleFriendsCheckbox}>{user.name}
                        {!index && <span className='purchase-form__badge'>me</span>}</PurchaseCheckbox>
                }
            )}
            {value.emails?.map((email, index) => {
                return <PurchaseCheckbox key={index}
                                         disabled={buyStatus === BuyStatus.inProgress}
                                         id={email}
                                         checked={value.emails?.includes(email) || false}
                                         onChange={handleInviteCheckbox}>{email}
                </PurchaseCheckbox>
            })}
            <PurchaseCheckbox disabled={buyStatus === BuyStatus.inProgress}
                              checked={showTextInput}
                              onChange={setShowTextInput}>
                Invite friends
            </PurchaseCheckbox>
            {showTextInput && <>
                <TextInput placeholder={'Enter email'}
                           value={textInputValue}
                           onChange={setTextInputValue}
                           disabled={buyStatus === BuyStatus.inProgress}
                           id={currentUser!.id}/>
                {emailInputError && <p>Incorrect email</p>}
                <Button disabled={buyStatus === BuyStatus.inProgress} onClick={() => handleBtnClick(textInputValue)}>Add to list</Button>
            </>}
            {hasRestrictions && value.emails?.length ?
                <PurchaseCheckbox disabled={buyStatus === BuyStatus.inProgress}
                                  checked={value.acknowledgeInviteAge}
                                  onChange={handleAcknowledgeInviteAgeCheckbox}>
                    I acknowledge that the game has age restriction and might be unavailable if a person is under required age.
                </PurchaseCheckbox> : ''}
            {value.emails?.length ?
            <PurchaseCheckbox disabled={buyStatus === BuyStatus.inProgress}
                              checked={value.acknowledgeInvite}
                              onChange={handleAcknowledgeInviteCheckbox}>
                I acknowledge that Game Market invitation emails will be sent to specified emails. The game will become available to the person only onсe the registration in the Game Market is completed.
            </PurchaseCheckbox> : ''}

        </>
    )
}
