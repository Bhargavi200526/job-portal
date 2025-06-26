import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { JobCategories, JobLocations } from '../assets/assets';

const AddJob: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [level, setLevel] = useState('');
  const [salary, setSalary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Job added successfully!');
  };

  return (
    <form
  onSubmit={handleSubmit}
className="w-full sm:w-[calc(100%-224px)] ml-0 sm:ml-6 p-6 rounded-lg shadow-xl border border-indigo-300 bg-gradient-to-br from-indigo-100 via-indigo-200 to-violet-100 space-y-6"
>
  <h2 className="text-2xl font-bold text-black mb-4">Add New Job</h2>

  {/* Job Title */}
  <div>
    <label className="block text-gray-800 font-semibold mb-1">Job Title</label>
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
      placeholder="Type here"
      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
    />
  </div>

  {/* Job Description */}
  <div>
    <label className="block text-gray-800 font-semibold mb-1">Job Description</label>
    <ReactQuill
      theme="snow"
      value={description}
      onChange={setDescription}
      className="bg-white border border-gray-300 rounded"
    />
  </div>

  {/* Dropdowns */}
  <div className="grid sm:grid-cols-3 gap-4">
    {/* Category */}
    <div>
      <label className="block text-gray-800 font-semibold mb-1">Job Category</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
      >
        <option value="">Select Category</option>
        {JobCategories.map((cat, idx) => (
          <option key={idx} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>

    {/* Location */}
    <div>
      <label className="block text-gray-800 font-semibold mb-1">Location</label>
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
      >
        <option value="">Select Location</option>
        {JobLocations.map((loc, idx) => (
          <option key={idx} value={loc}>
            {loc}
          </option>
        ))}
      </select>
    </div>

    {/* Level */}
    <div>
      <label className="block text-gray-800 font-semibold mb-1">Level</label>
      <select
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        required
        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
      >
        <option value="">Select Level</option>
        <option value="Junior">Junior</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Senior">Senior</option>
      </select>
    </div>
  </div>

  {/* Salary */}
  <div className="max-w-xs">
    <label className="block text-gray-800 font-semibold mb-1">Salary (₹)</label>
    <input
    type="number"
    value={salary}
    onChange={(e) => setSalary(e.target.value)}
    required
    min="0"
    placeholder="Enter salary"
    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>
  </div>

  {/* Submit Button */}
  <div className="text-center">
    <button
      type="submit"
      className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
    >
      Add Job
    </button>
  </div>
</form>
)
};

export default AddJob;
