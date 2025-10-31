import AdminWordForm from '../AdminWordForm';

export default function AdminWordFormExample() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <AdminWordForm
          onSubmit={(data) => console.log('Word submitted:', data)}
        />
      </div>
    </div>
  );
}
