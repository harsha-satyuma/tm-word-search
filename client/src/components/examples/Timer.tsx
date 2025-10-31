import Timer from '../Timer';

export default function TimerExample() {
  return (
    <div className="flex items-center justify-center p-8">
      <Timer
        duration={300}
        onTimeUp={() => console.log('Time is up!')}
        onTick={(remaining) => console.log('Time remaining:', remaining)}
      />
    </div>
  );
}
