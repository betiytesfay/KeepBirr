'use client'
import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import EmojiPicker from 'emoji-picker-react';
const moneyOwed = 1000;


function Layout({ layout }) {
  const [choosenEmoji, setChoosenEmoji] = useState(null);
  const onEmojiClick = (emojiData, event) => {
    setChoosenEmoji(emojiData.emoji);
    setShowEmojiPicker(false);
  }
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const HandleAddPopup = () => {
    setShowAddPopup(true);

  }
  const HandleCloseModal = () => {
    setShowAddPopup(false);
  }
  return (
    <div className="p-4 ml-5">
      <div className=" border shadow-lg p-5 rounded-lg mt-20">
        <p>
          Total money owed {moneyOwed}
        </p>
      </div>
      <div className="flex flex-row justify-between ">

        <h2 className="text-xl font-bold mb-4">DEBT OVERVIEW </h2>
        <div className="flex">
          <div className="justify-end m-1">
            <button className="bg-blue-400 text-white px-2 py-1 rounded-xl hover:bg-blue-500 font-semibold" onClick={HandleAddPopup}>
              +ADD
            </button>
            <button className="bg-blue-400 text-white px-2 py-1 rounded-xl hover:bg-blue-500 font-semibold">
              filter
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 mt-5 gap-4 p-4 shadow-sm rounded">
        <p className="font-semibold">
          Name
        </p>
        <p className="font-semibold">
          Amount
        </p>
        <p className="font-semibold">
          Phone number
        </p>
        <p className="font-semibold">
          telegram
        </p>
        <p className="font-semibold">
          reason
        </p>

      </div>

      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative">
            <div className=" flex flex-row border-b-1 justify-between shadow-sm">
              <h2 className="font-bold">Add Debt</h2>

              <MdClose onClick={HandleCloseModal} />
            </div>

            <div className="flex flex-col">
              {showEmojiPicker && (
                <EmojiPicker onEmojiClick={onEmojiClick} />
              )}
              <div className="" onClick={() => { setShowEmojiPicker(!showEmojiPicker) }}>
                {choosenEmoji}
                <p>Pick icon</p>
              </div>
              <label>Lender</label>
              <input type="text" placeholder="Name" className="rounded-sm bg-blue-50 p-3 " />
              <label> Amount</label>
              <input type="decimal" placeholder="350" className="rounded-sm bg-blue-50 p-3" />
              <label>Phone Number</label>
              <input type="tel" placeholder="+251987654321" className="rounded-sm bg-blue-50 p-3" />
              <label>Telegram Account</label>
              <input type="text" placeholder="@username" className="rounded-sm bg-blue-50 p-3" />
              <label>reason</label>
              <input type="text" placeholder="reason " className="rounded-sm bg-blue-50 p-3" />
            </div>
          </div>
        </div>
      )
      }

    </div>
  )
}
export default Layout;