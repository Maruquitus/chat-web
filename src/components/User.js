export function User(props) {
  return (
    <div
      className='border-b border-gray-100 h-20 px-6 py-2 w-full rounded-sm z-00 cursor-pointer hover:translate-x-2 hover:shadow-sm bg-white hover:shadow-gray-100 duration-300 flex'
    >
      <img
        src={props.photo}
        className="w-12 h-12 mr-2 -ml-2 mt-1.5 rounded-full inline-flex"
      />
      <div className="lg:w-full md:w-11/12 w-10/12 mt-4">
        <h1 className={"text-black truncate text-lg w-11/12 md:w-full "}>
          {props.name}
        </h1>
      </div>
    </div>
  );
}
