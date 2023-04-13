import "./Counter.css";

interface Props {
  num: number;
}

function Counter({ num }: Props) {
  const numStr = toStr(num);
  return (
    <div className="counter">
      {renderDigits(numStr)}
    </div>
  );
}

function renderDigits(num: string): JSX.Element {
  const res = [];
  for (let i = 0; i < num.length; i ++) {
    res.push(<div key={i} className={`digit d${num[i]}`}></div>)
  }
  return <>{res}</>;
}

function toStr(num: number): string {
  if (num > 999) num = 999;
  if (num < 0) num = 0;
  if (num < 10) return '00' + num;
  if (num < 100) return '0' + num;
  return num + '';
}

export default Counter;