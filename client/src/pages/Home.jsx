import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "framer-motion"
import LoginModal from '../components/LoginModal'
import { useDispatch, useSelector } from 'react-redux'
import { Coins, Sun, Moon } from "lucide-react"
import { serverUrl } from '../App'
import axios from 'axios'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from '../context/ThemeContext'
function Home() {

    const highlights = [
        {
            title: "AI Generated Code",
            description: "Buildex.ai builds real websites — clean code, animations, responsiveness and scalable structure."
        },
        {
            title: "Fully Responsive Layouts",
            description: "Creates websites that look perfect on every device - mobile, tablet, and desktop."
        },
        {
            title: "Production Ready Output",
            description: "Get clean, optimized, and scalable code that’s ready to deploy instantly."
        }
    ]

    const [openLogin, setOpenLogin] = useState(false)
    const { userData } = useSelector(state => state.user)
    const [openProfile, setOpenProfile] = useState(false)
    const [websites, setWebsites] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { theme, toggleTheme } = React.useContext(ThemeContext)

    const handleLogOut = async () => {
        console.log("logout click")
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))
            setOpenProfile(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!userData) return;
        const handleGetAllWebsites = async () => {

            try {

                const result = await axios.get(`${serverUrl}/api/website/get-all`, { withCredentials: true })
                setWebsites(result.data || [])

            } catch (error) {
                console.log(error)

            }
        }
        handleGetAllWebsites()
    }, [userData])
    return (
        <div className='relative min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 overflow-hidden'>
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className='fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700'
            >
                <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
                    <div className='text-lg font-semibold'>
                        Buildex.ai
                    </div>
                    <div className='flex items-center gap-5'>
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition">
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <div className='hidden md:inline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 cursor-pointer' onClick={() => navigate("/pricing")}>
                            Pricing
                        </div>
                        {userData && <div className='hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition' onClick={() => navigate("/pricing")}>
                            <Coins size={14} className='text-yellow-400' />
                            <span className='text-gray-700 dark:text-gray-300'>Credits</span>
                            <span>{userData.credits}</span>
                            <span className='font-semibold'>+</span>
                        </div>}


                        {!userData ? <button className='px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm'
                            onClick={() => setOpenLogin(true)}
                        >

                            

                            Get Started
                        </button>
                            :
                            <div className='relative'>
                                <button className='flex items-center' onClick={() => setOpenProfile(!openProfile)}>
                                    <img src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData.name}`} alt="" referrerPolicy='no-referrer' className='w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 object-cover' />
                                </button>
                                <AnimatePresence>
                                    {openProfile && (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                className="absolute right-0 mt-3 w-60 z-50 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden"
                                            >
                                                <div className='px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
                                                    <p className='text-sm font-medium truncate'>{userData.name}</p>
                                                    <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>{userData.email}</p>
                                                </div>

                                                <button className='md:hidden w-full px-4 py-3 flex items-center gap-2 text-sm border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'>
                                                    <Coins size={14} className='text-yellow-400' />
                                                    <span className='text-gray-700 dark:text-gray-300'>Credits</span>
                                                    <span>{userData.credits}</span>
                                                    <span className='font-semibold'>+</span>
                                                </button>

                                                <button className='w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700' onClick={() => navigate("/dashboard")}>Dashboard</button>
                                                <button className='w-full px-4 py-3 text-left text-sm text-red-500 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700' onClick={handleLogOut}>Logout</button>

                                            </motion.div>
                                        </>

                                    )}

                                </AnimatePresence>

                            </div>

                        }

                    </div>
                </div>
            </motion.div>

            <section className='pt-44 pb-32 px-6 text-center'>
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight"
                >
                    Build Modern Websites <br />with
                    <span className='bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'> AI</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mt-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-lg'
                >
                    Describe your idea and let AI generate a modern,
                    responsive, production-ready website.
                </motion.p>


                <button className="px-10 py-4 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-black font-semibold hover:scale-105 transition mt-12" onClick={() =>userData? navigate("/dashboard"):setOpenLogin(true)}>{userData ? "Go to dashboard" : "Get Started"}</button>

            </section>
            {!userData && <section className='max-w-7xl mx-auto px-6 pb-32'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
                    {highlights.map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 shadow-sm"
                        >
                            <h1 className='text-xl font-semibold mb-3'>{h}</h1>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                {h.description}
                            </p>

                        </motion.div>
                    ))}
                </div>
            </section>}


            {userData && websites?.length > 0 && (
                <section className='max-w-7xl mx-auto px-6 pb-32'>
                    <h3 className='text-2xl font-semibold mb-6'>Your Websites</h3>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {websites.slice(0, 3).map((w, i) => (
                            <motion.div
                                key={w._id}
                                whileHover={{ y: -6 }}
                                onClick={() => navigate(`/editor/${w._id}`)}
                                className="cursor-pointer rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
                            >
                                <div className='h-40 bg-gray-100 dark:bg-gray-900'>
                                    <iframe
                                        srcDoc={w.latestCode}
                                        className='w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white'
                                    />
                                </div>
                                <div className='p-4'>
                                    <h3 className='text-base font-semibold line-clamp-2'>{w.title}</h3>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>Last Updated {""}
                                        {new Date(w.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>


                            </motion.div>
                        ))}

                    </div>
                </section>

            )}



            <footer className='border-t border-gray-200 dark:border-gray-700 py-10 text-center text-sm text-gray-500 dark:text-gray-400'>
                &copy; {new Date().getFullYear()} Buildex.ai Designed & Built with ❤️
            </footer>

            {openLogin && <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />}

        </div>
    )
}

export default Home
