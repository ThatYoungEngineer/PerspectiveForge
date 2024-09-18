import { useState } from 'react'
import {app} from '../utils/firebase.js'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { Button, Alert, Spinner } from "flowbite-react"
import { AiFillGoogleCircle } from 'react-icons/ai'
import { IoCloseCircleOutline } from "react-icons/io5"
import { IoIosCheckmarkCircleOutline } from "react-icons/io"

import { useDispatch, useSelector } from'react-redux'
import { oAuth } from '../store/userSlice.js'
import { useLocation, useNavigate } from 'react-router'

 
  const OAuth = (props) => {
    const dispatch = useDispatch()  
    const { status } = useSelector(state=>state.user)
    const [successMessage, setSuccessMessage] = useState('') 
    const [errorMessage, setErrorMessage] = useState('') 
    const [btnDisable, setBtnDisable] = useState('')

    const navigate = useNavigate()
    const location = useLocation()  
    let from = location.state?.prevLocation || '/'

    const handleGoogleClick = async () => {
        const auth = getAuth(app)
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
    
        try {
            props.getSignUpError("")
            props.getSignUpSuccess("")
            setBtnDisable('disabled')
            props.getAuthBtnDisabled('disabled')
            const resultFromGoogle = await signInWithPopup(auth, provider)
            const userData = resultFromGoogle._tokenResponse
            const responseData = await dispatch(oAuth(userData))
            if (responseData?.error) props.getSignUpError(responseData?.error.message)
            else {
                props.getSignUpSuccess(responseData.payload.message)
                navigate(from, { replace: true })
            }
            setBtnDisable('')
        } catch (error) {
            if (error.message.includes('popup-closed-by-user')) props.getSignUpError('Error! Please try again.')
            else if (error.message.includes('unauthorized-domain')) props.getSignUpError('Access denied! Please try again later.')
            else props.getSignUpError('Please check your internet connection and try again.')
            setBtnDisable('')
            props.getAuthBtnDisabled('')
        }
    }

    return ( 
        <>
            <Button gradientDuoTone="pinkToOrange" outline type='button' onClick={handleGoogleClick} disabled={ btnDisable === "disabled" || status == "loading" } >
                {btnDisable === "disabled"
                ? <Spinner />
                : (
                    <>
                        <AiFillGoogleCircle size={20} className='mr-2' />
                        Continue with Google    
                    </>
                )}
            </Button>

            {successMessage && (
                <Alert color="success" icon={IoIosCheckmarkCircleOutline} className=''>
                    {successMessage}
                </Alert>
            )}

            {errorMessage && (
                <Alert color="failure" icon={IoCloseCircleOutline} className=''>
                    {errorMessage}
                </Alert>
            )}

        </>
    )
}

export default OAuth