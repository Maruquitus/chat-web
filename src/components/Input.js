export function Input(props) {
    return (
        <div className="w-full row grid">
            <label className='text-black font-semibold'>{props.título}</label>
            <input id={props.id} className='text-black h-8 bg-slate-100 shadow-sm rounded-md outline-0 font-medium p-1' type={props.tipo}></input>
        </div>
    )
  }