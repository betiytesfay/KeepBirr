import React from 'react';
const moneyOwed = 1000;
function Layout({ layout }) {
  return (
    <div className="p-4 ml-5 border shadow-lg">
      Total money owed {moneyOwed}
    </div>
  )
}
export default Layout;