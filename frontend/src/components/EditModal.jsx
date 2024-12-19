import React from 'react'

const EditModal = ({isOpen, onClose, children}) => {
    if(!isOpen) return null;
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30'>
     <div className='bg-gradient-to-r from-blue-100 to-purple-200 rounded-lg p-4 shadow-lg w-64'>
        <div className='flex justify-end'>
            <button onClick={onClose} className='text-gray-500 text-2xl'>&times;</button>
        </div>
        <div className="flex flex-col space-y-2 mt-2">{children}</div>
     </div>
    </div>
  )
}

export default EditModal
