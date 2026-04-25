export default function FormHeader({ title, description }: { title:string, description:string }) {
    return (
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
            <p className="text-13 text-gray-500 mt-2 font-medium">{description}</p>
        </div>
  );
}