export function Button(props) {
    return (
      <button id={props.id} onClick={props.action} className='bg-secondary-color w-48 h-8 self-center mx-auto rounded-2xl font-bold hover:scale-105 hover:bg-blue-400 ease-in-out duration-300'>
        {props.text}
      </button>
    );
  }