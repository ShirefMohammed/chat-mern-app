/* eslint-disable react/prop-types */
const ProfileCard = ({ anotherUser, setOpenProfileCard }) => {
  return (
    <div className='fixed top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 
      z-50 w-full max-w-xs rounded-md shadow-md py-12 px-4 bg-white flex
      flex-col items-center'
    >
      <span
        onClick={() => setOpenProfileCard(false)}
        className="absolute top-3 right-3 text-2xl cursor-pointer
          hover:text-red-500"
      >
        x
      </span>

      <img
        src={anotherUser.picture}
        alt="mainUser picture"
        className="w-24 h-24 object-cover shadow-md p-1"
      />

      <span className="mt-5">{anotherUser.name}</span>

      <span>{anotherUser.email}</span>
    </div>
  )
}

export default ProfileCard
