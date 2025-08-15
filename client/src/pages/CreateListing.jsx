import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    imageUrl: [],
    name: "",
    description: "",
    address: "",
    type: "",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length < 7) {
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setForm((prev) => ({
          ...prev,
          imageUrl: prev.imageUrl.concat(urls),
        }));
      });
    }
  };

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // if (form.imageUrls.length < 1)
      if (+form.regularPrice < +form.discountPrice)
        // return setError("You must upload at least one image");
        return setError("Discount Price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg bg-white"
            id="name"
            maxLength="62"
            min="10"
            required
            onChange={handleChange}
            value={form.name}
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg bg-white"
            id="description"
            required
            onChange={handleChange}
            value={form.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg bg-white"
            id="address"
            required
            onChange={handleChange}
            value={form.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="type"
                className="w-5"
                onChange={() => setForm((prev) => ({ ...prev, type: "sale" }))}
                checked={form.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="type"
                className="w-5"
                onChange={() => setForm((prev) => ({ ...prev, type: "rent" }))}
                checked={form.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={form.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={form.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={form.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg bg-white"
                onChange={handleChange}
                value={form.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg bg-white"
                onChange={handleChange}
                value={form.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                required
                className="p-3 border border-gray-300 rounded-lg bg-white"
                onChange={handleChange}
                value={form.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {form.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="100000"
                  required
                  className="p-3 border border-gray-300 rounded-lg bg-white"
                  onChange={handleChange}
                  value={form.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-200 rounded w-full 
             file:bg-gray-300 file:text-gray-800 
             file:border-0 file:rounded file:px-4 file:py-2 
             file:hover:bg-gray-400 file:cursor-pointer"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-88"
            >
              Upload
            </button>
          </div>
          <button
            disabled={loading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 "
          >
            {loading ? `creating...` : `Create Listing`}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
