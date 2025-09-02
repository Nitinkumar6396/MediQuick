import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AddDoctor = () => {

  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const { backendUrl, aToken } = useContext(AdminContext)

  const submitHandler = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      if (!docImg) {
        return toast.error("Image Not Selected");
      }

      const formData = new FormData();
      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('speciality', speciality);
      formData.append('experience', experience);
      formData.append('fees', fees);
      formData.append('about', about);
      formData.append('degree', degree);
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

      const { data } = await axios.post(
        backendUrl + '/api/admin/add-doctor',
        formData,
        { headers: { token: aToken } }
      );

      toast.success(data.message)
      setDocImg(false)
      setName('')
      setEmail('')
      setPassword('')
      setFees('')
      setAbout('')
      setDegree('')
      setAddress1('')
      setAddress2('')
    } catch (error) {
      console.log(error);

      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // show custom backend error
      } else {
        toast.error("Something went wrong");
      }
    }
    setLoading(false)
  }

  return (
    <form onSubmit={submitHandler} className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium'>Add Doctor</p>
      <div className='bg-white p-8 border rounded w-full max-w-4xl max-h-[75vh] overflow-y-scroll'>
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img">
            <img className='w-14 rounded-full bg-gray-300 cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          <p>Upload doctor <br />picture</p>
        </div>

        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
          <div className='w-full flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor name</p>
              <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Email</p>
              <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Password</p>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Password'
                  required
                  className="border rounded px-3 py-2 pr-10 w-full"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>


            <div className='flex-1 flex flex-col gap-1'>
              <p>Experience</p>
              <select onChange={(e) => setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2' name="" id="">
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="9 Year">9 Year</option>
                <option value="10 Year">10 year</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Fees</p>
              <input onChange={(e) => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='Fees' required />
            </div>
          </div>

          <div className='w-full flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Speciality</p>
              <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className='border rounded px-3 py-2' name="" id="">
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Education</p>
              <input onChange={(e) => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type="text" placeholder='Education' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Address</p>
              <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Address 1' required />
              <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Address 2' required />
            </div>
          </div>
        </div>

        <div className='mt-4 mb-2 text-gray-600'>
          <p>About Doctor</p>
          <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='border rounded w-full px-4 py-2' placeholder='Write about doctor' rows={5} />
        </div>
        <button disabled={loading} className={`text-white text-md px-8 py-2 rounded-full ${loading ? "bg-blue-300" : "bg-primary"}`}>{loading ? "Adding..." : "Add doctor"}</button>
      </div>
    </form>
  )
}

export default AddDoctor