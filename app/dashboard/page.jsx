import React, { Children } from 'react'

function page({ Children }) {
  return (
    <div>
      <div>page</div>
      <div>
        {Children}
      </div>
    </div>
  )
}

export default page