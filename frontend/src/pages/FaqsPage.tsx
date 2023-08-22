import React, { useState } from "react";
import styles from "../styles/styles";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const faqsData = [
    {
        id: '1',
        title: 'What is your return policy?',
        content: "If you're not satisfied with your purchase, we accept returns within 30 days of delivery.To initiate a return, please email us at support@myecommercestore.com with your order number and a brief explanation of why you're returning the item."
    },
    {
        id: '2',
        title: 'How do I track my order?',
        content: "You can track your order by clicking the tracking link in your shipping confirmation email, or by logging into your account on our website and viewing the order details."
    },
    {
        id: '3',
        title: 'How do I contact customer support?',
        content: "You can contact our customer support team by emailing us at support@myecommercestore.com, or by calling us at (555) 123-4567 between the hours of 9am and 5pm EST, Monday through Friday."
    },
    {
        id: '4',
        title: 'Can I change or cancel my order?',
        content: "Unfortunately, once an order has been placed, we are not able to make changes or cancellations. If you no longer want the items you've ordered, you can return them for a refund within 30 days of delivery."
    },
    {
        id: '5',
        title: 'Do you offer international shipping?',
        content: "Currently, we only offer shipping within the United States."
    },
    {
        id: '6',
        title: 'What payment methods do you accept?',
        content: "We accept visa,mastercard,paypal payment method also we have cash on delivery system."
    },
] as {
    id: string,
    title: string,
    content: string
}[]

const FAQPage = () => {
    return (
        <div>
            <Header activeHeading={5} />
            <Faq />
            <Footer />
        </div>
    );
};

const Faq = () => {
    const [activeTab, setActiveTab] = useState<{ tab: string }>();

    const toggleTab = (tab: any) => {
        if (activeTab?.tab === tab) {
            setActiveTab({ tab: 'false' })
        } else {
            setActiveTab({ tab: tab })
        }
    };

    return (
        <div className={`${styles.section} my-8`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">FAQ</h2>
            <div className="mx-auto space-y-4">
                {/* single Faq */}
                {faqsData?.map(({ id, title, content }: any) => (
                    <div key={id} className="border-b border-gray-200 pb-4">
                        <button
                            className="flex items-center justify-between w-full"
                            onClick={() => toggleTab(id)}
                        >
                            <span className="text-lg font-medium text-gray-900">
                                {title}
                            </span>
                            {activeTab?.tab === id ? (
                                <svg
                                    className="h-6 w-6 text-gray-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="h-6 w-6 text-gray-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            )}
                        </button>
                        {activeTab?.tab === id && (
                            <div className="mt-4 ">
                                <p className="text-base text-gray-500">
                                    {content}
                                </p>
                            </div>
                        )}
                    </div>
                ))
                }
            </div>
        </div>
    );
};

export default FAQPage;