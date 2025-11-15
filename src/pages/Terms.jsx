import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Terms &amp; Conditions</h1>
      <p className="text-gray-700">This is a placeholder for terms and conditions. Replace with real legal text before production.</p>
      <p className="mt-4"><Link to="/signup" className="text-blue-600">Return to signup</Link></p>
    </div>
  );
}
