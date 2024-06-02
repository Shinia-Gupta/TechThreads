import React from 'react';
import { HiArrowNarrowUp} from "react-icons/hi";

function DashCard({ heading, totalCount, classStyle, icon: Icon, lastMonthCount }) {
    return (
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
            <div className='flex justify-between'>
                <div>
                    <h3 className='text-gray-500 text-md uppercase'>{heading}</h3>
                    <p className='text-2xl'>{totalCount}</p>
                </div>
                <Icon className={`${classStyle.bg} text-white rounded-full text-5xl p-3 shadow-lg`} />
            </div>
            <div className='flex gap-2 text-sm'>
                <span className={`${classStyle.textColor} flex items-center`}>
                    <HiArrowNarrowUp />
                    {lastMonthCount}
                </span>
                <div className='text-gray-500'>Last month</div>
            </div>
        </div>
    );
}

export default DashCard;
