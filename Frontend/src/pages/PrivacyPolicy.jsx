import { GoDotFill } from "react-icons/go";


const PrivacyPolicy = () => {

    const sections = [
        {
            "id": 1,
            "title": "Information We Collect",
            "content": [
                {
                    "title": "Personal Information",
                    "description": "When you register on PerspectiveForge, we collect your name, email address, and any other information you provide."
                },
                {
                    "title": "Content",
                    "description": "We collect any content you post, such as blog posts, comments, and media files."
                },
                {
                    "title": "Usage Data",
                    "description": "We collect information about your interactions with the platform, such as IP address, browser type, and the pages you visit."
                }
            ]
        },
        {
            "id": 2,
            "title": "How We Use Your Information",
            "content": [
                {
                    "title": "To Provide Services",
                    "description": "We use your information to create and manage your account, deliver content, and provide support."
                },
                {
                    "title": "To Improve Our Platform",
                    "description": "Usage data helps us understand how our platform is used and improve user experience."
                },
                {
                    "title": "To Communicate with You",
                    "description": "We may send updates, newsletters, and promotional materials. You can opt-out at any time."
                }
            ]
        },
        {
            "id": 3,
            "title": "Sharing Your Information",
            "content": [
                {
                    "title": "With Third Parties",
                    "description": "We do not sell or share your personal information with third parties, except to provide our services, comply with legal obligations, or protect our rights."
                },
                {
                    "title": "Legal Requirements",
                    "description": "We may disclose your information if required by law or if we believe it is necessary to prevent fraud or protect our users."
                }
            ]
        },
        {
            "id": 4,
            "title": "Data Security",
            "content": [
                {
                    "title": "Protection Measures",
                    "description": "We implement appropriate technical and organizational measures to protect your data from unauthorized access, disclosure, or destruction."
                },
                {
                    "title": "Your Responsibility",
                    "description": "You are responsible for keeping your account credentials secure. Notify us immediately if you suspect any unauthorized access."
                }
            ]
        },
        {
            "id": 5,
            "title": "Your Rights",
            "content": [
                {
                    "title": "Access and Correction",
                    "description": "You have the right to access the personal information we hold about you and request corrections."
                },
                {
                    "title": "Data Deletion",
                    "description": "You may request the deletion of your personal data. We will comply unless we are required to retain it for legal reasons."
                }
            ]
        },
        {
            "id": 6,
            "title": "Changes to This Privacy Policy",
            "content": [
                {
                    "description": "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review our Privacy Policy periodically."
                }
            ]
        },
        {
            "id": 7,
            "title": "Contact Us",
            "content": [
                {
                    "description": "If you have any questions or concerns about this Privacy Policy, please contact us at support@perspectiveforge.com."
                }
            ]
        }
    ]


    return (
        <div className="w-screen flex flex-col">
            <div className="w-screen min-h-full p-16">
                <h1 className='font-Onest-Medium text-2xl text-center '>Privacy Policy for
                    <span className='font-Onest-Bold'> Perspective Forge</span>
                </h1>
                <h2 className="border-b w-fit">
                    Effective Date: 22 Jan, 2025
                </h2>
                <p className='mt-5'>
                    Welcome to <b>Perspective Forge</b>. Your privacy is important to us, and we are committed to protecting the personal information you share with us. This Privacy Policy outlines how we collect, use, and safeguard your information.
                </p>
                {(sections && sections?.length>0) && sections?.map((section) => {
                    return (
                        <div key={section.id} className='mt-7'>
                            <div className='flex flex-row gap-2 font-Onest-SemiBold text-2xl'>
                                <h2>{section.id}.</h2>
                                <h2> {section.title}</h2>
                            </div>
                            {section.content && section.content.map((content, index) => (
                                <>
                                    {content?.title && <p key={index} className='text-lg pl-2 pt-3 pb-2 w-fit underline' >{content?.title}: </p> }
                                    <p className={`text-sm flex gap-2 pl-4 ${content?.title ? 'pt-0 pb-0' : 'pt-3 pb-2'} `}>
                                        <GoDotFill />
                                        {content.description}
                                    </p>
                                </>
                            ))}
                        </div>
                        
                    )
                })}

            </div>
        </div>

    )
}

export default PrivacyPolicy
