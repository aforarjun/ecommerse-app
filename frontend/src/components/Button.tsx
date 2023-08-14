import React from 'react'

const Button = ({
    title,
    ...props
}: any) => {
    return (
        <button
            className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            {...props}
        >
            {title}
        </button>
    )
}

export default Button