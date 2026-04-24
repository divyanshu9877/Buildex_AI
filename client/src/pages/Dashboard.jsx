import { ArrowLeft, Check, Rocket, Share2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
function Dashboard() {
    const { userData } = useSelector(state => state.user)
    const navigate = useNavigate()
    const [websites, setWebsites] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [copiedId, setCopiedId] = useState(null)
    const handleDeploy = async (id) => {
        try {
            const result = await axios.get(`${serverUrl}/api/website/deploy/${id}`, { withCredentials: true })
            window.open(`${result.data.url}`, "_blank")
            setWebsites((prev) =>
        prev.map((w) =>
          w._id === id
            ? { ...w, deployed: true, deployUrl: result.data.url }
            : w
        )
      );
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const handleGetAllWebsites = async () => {
            setLoading(true)
            try {

                const result = await axios.get(`${serverUrl}/api/website/get-all`, { withCredentials: true })
                setWebsites(result.data || [])
                setLoading(false)
            } catch (error) {
                console.log(error)
                setError(error.response.data.message)
                setLoading(false)
            }
        }
        handleGetAllWebsites()
    }, [])

    const handleCopy = async (site) => {
        await navigator.clipboard.writeText(site.deployUrl)
        setCopiedId(site._id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50'>
            <div className='sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700'>
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <button className='p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition' onClick={() => navigate("/")}><ArrowLeft size={16} /></button>
                        <h1 className='text-lg font-semibold'>Dashboard</h1>
                    </div>
                    <button className='px-4 py-2 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-black text-sm font-semibold hover:scale-105 transition' onClick={() => navigate("/generate")}>
                        + New Website
                    </button>
                </div>
            </div>
            <div className='max-w-7xl mx-auto px-6 py-10'>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>Welcome Back</p>
                    <h1 className='text-3xl font-bold'>{userData.name}</h1>
                </motion.div>

                {loading && (
                    <div className="mt-24 text-center text-gray-500 dark:text-gray-400">Loading Your Websites...</div>
                )}

                {error && !loading && (
                    <div className="mt-24 text-center text-red-500 dark:text-red-400">{error}</div>
                )}

                {websites?.length == 0 && (
                    <div className="mt-24 text-center text-gray-500 dark:text-gray-400">You have no websites</div>
                )}

                {!loading && !error && websites?.length > 0 && (
                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8'>
                        {websites.map((w, i) => {

                            const copied = copiedId === w._id

                            return <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -6 }}
                               
                                className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-700 transition flex flex-col shadow-sm"
                            >
                                <div className='relative h-40 bg-gray-200 dark:bg-black cursor-pointer'  onClick={()=>navigate(`/editor/${w._id}`)}>
                                    <iframe srcDoc={w.latestCode} className='absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white' />
                                    <div className='absolute inset-0 bg-gray-900/10 dark:bg-black/30' />
                                </div>

                                <div className='p-5 flex flex-col gap-4 flex-1'>
                                    <h3 className='text-base font-semibold line-clamp-2'>{w.title}</h3>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>Last Updated {""}
                                        {new Date(w.updatedAt).toLocaleDateString()}
                                    </p>

                                    {!w.deployed ? (
                                        <button className=" mt-auto flex items-center justify-center gap-2
                          px-4 py-2 rounded-xl text-sm font-semibold
                          bg-gradient-to-r from-indigo-500 to-purple-500
                          hover:scale-105 transition
                        "
                                            onClick={() => handleDeploy(w._id)}

                                        ><Rocket size={18} /> Deploy</button>
                                    ) : (<motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleCopy(w)}
                                        className={`
                          mt-auto flex items-center justify-center gap-2
                          px-4 py-2 rounded-xl text-sm font-medium
                          transition-all
                          ${copied
                                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400"
                                                : "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-gray-300"
                                            }
                        `}
                                    >
                                        { copied?(
                                            <>
                                            <Check size={14}/>
                                            Link Copied
                                            </>
                                        ):
                                        <>
                                        <Share2 size={14}/>
                                        Share Link
                                        </>
                                        }
                                    </motion.button>)}

                                </div>

                            </motion.div>
                        })}

                    </div>
                )}


            </div>
        </div>
    )
}

export default Dashboard
