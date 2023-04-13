import Counter from "./counter/Counter";

interface Props {
  flagCount: number;
}

function FlagCounter({ flagCount }: Props) {
  return (
    <div className="flagCounter">
      <Counter num={flagCount} />
    </div>
  );
}

export default FlagCounter;