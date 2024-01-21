import { processDate } from "@/app/dateCalculator";

export function DateHeader(props) {
  let text = processDate(props.date);

  return (
    <div className="w-fit p-2 bg-slate-50 rounded-lg shadow-md shadow-custom align-middle mx-auto mb-3">
      <p className="text-gray-700">
        {text}
      </p>
    </div>
  );
}
