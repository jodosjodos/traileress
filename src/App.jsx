import './App.css'
import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import Axios from 'axios'
import { MovieCard } from './components/MovieCard';
import  YouTube  from 'react-youtube';
import { AiOutlineSearch } from 'react-icons/ai';
import {FaCopyright} from "react-icons/fa"

function App() {
  const imageUrl="https://image.tmdb.org/t/p/w1280"
  const[movies,setMovies]=useState([])
  const[selectedMovie,setSelectedMovie]=useState({})
  const [playTrailer,setPlayTrailer]=useState(false)
  const [notFound,setNotFound]=useState(false)
  const apiUrl="https://api.themoviedb.org/3";

  const apiKey="253eb6a5f22792e1412b47d42d247239"
 
  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    try {
      const movieResults = await Axios.get(`https://api.themoviedb.org/3/${type}/movie?api_key=${apiKey}`);
      const tvShowsResults = await Axios.get(`https://api.themoviedb.org/3/${type}/tv?api_key=${apiKey}`);
      if(movieResults.status===404 || tvShowsResults.status===404  ){
        setNotFound(true)
      }
  
      const data = [...movieResults.data.results, ...tvShowsResults.data.results];
  console.log(tvShowsResults.data.results);
      setMovies(data);
      await selectMovie(data[0]);
    } catch (error) {
      console.error(error);
    }
  };

const fetchMoviesSearching = async (searchKey) => {
  const type = searchKey ? "search" : "discover";
  try {
    const results = await Axios.get(`https://api.themoviedb.org/3/${type}/multi`, {
      params: {
        api_key: apiKey,
        query: searchKey
      }
    });

    if (results.data.results.length === 0) {
      setNotFound(true)
      return;
    }
    if(results.status===404 || results.status===34){
      setNotFound(true)
    }

    setMovies(results.data.results);
    await selectMovie(results.data.results[0]);
  } catch (error) {
    console.error(error);
  }
};

  
const fetchMovie = async (id) => {
  try {
    const response = await Axios.get(`${apiUrl}/movie/${id}`, {
      params: {
        api_key: apiKey,
        append_to_response: "videos",
      },
    });

    if (response.status === 200 && response.data) {
      return response.data;
    }

    const tvShowResponse = await Axios.get(`${apiUrl}/tv/${id}`, {
      params: {
        api_key: apiKey,
        append_to_response: "videos",
      },
    });

    if (tvShowResponse.status === 200 && tvShowResponse.data) {
      return tvShowResponse.data;
    }

    throw new Error("Movie or TV show not found");
  } catch (error) {
    console.error(error);
  }
};

const selectMovie = useCallback(async (movie) => {
  if (!movie) {
    setNotFound(true);
    return;
  }
  try {
    const data = await fetchMovie(movie.id);
    setPlayTrailer(false);
    if (data) {
      if(data.videos <=0){
        setNotFound(true)
      }
      
      setSelectedMovie(data);
    } else {
      setNotFound(true);
    }
  } catch (error) {
    console.log(error);
    setPlayTrailer(false);
    setSelectedMovie(movie);
  }
}, [movies]);

  
  

  const renderTrailer = () => {
    try {
      if(selectedMovie.videos){
        if (selectedMovie && selectedMovie.videos && selectedMovie.videos.results && selectedMovie.videos.results.length > 0) {
          const trailer = selectedMovie.videos.results.find((vid) => vid.name === "Official Trailer");
          const key = trailer ? trailer.key : selectedMovie.videos.results[0].key;
          return (
            <YouTube
              videoId={key}
              className=''
             
              opts={{
                // width: "120px",
                playerVars: {
                  autoplay: true,
                },
              }}
            />
          );
        } else {
          console.log('no video');
          setNotFound(true)
          return
         
        
        }
      }else{
console.log('no video');
setNotFound(true) 
return
      }
     
    } catch (error) {
      console.log(error);
    }
  };
  

  useEffect(()=>{
      fetchMovies()
  },[])
  
  const renderMovies=()=>{
    
      return movies.map((movie)=>{
        // if(!movie.videos){
        //   console.log('reaching it');
        //   setNotFound(true)
        //   return
        // }
          return <MovieCard
          key={movie.id}
          movie={movie}
          selectMovie={selectMovie}
          />
      })
  }
  const MemoMovies=useMemo(()=>{
    return renderMovies
  },[movies])
// console.log(movies[0].original_title);
  const [searchKey,setSearchKey]=useState("")
  


  const searching = (e) => {
    setNotFound(false);
    const targetValue = e.target.value;
    setSearchKey(targetValue);
  };
   


  
    const searchMovie = (e) => {
      e.preventDefault();
      fetchMoviesSearching(searchKey);
    }
  

    const inputRef=useRef(null)
    const handleRef=()=>{
      const value=inputRef.current.value;
      if(value===""){
        inputRef.current.focus()
      }else{
        inputRef.current.value=""
      }
    }
  

return(
<div className={`grid grid-row-3 h-full `} >
   <header className='header grid grid-cols-2 gap-10 m-0'>
      
       
      <h1 className="title">Traileress</h1>
     
    
      <form onSubmit={searchMovie} className="flex justify-center items-center">
  <input type="text" name="searchInput" id="seachInput" onChange={searching} className="search" ref={inputRef} placeholder='search trailer....' />
  <button type="submit" className=" searchButton" onClick={handleRef}><AiOutlineSearch size={40}/></button>
</form>

      
   </header>
   <section className={`h-[80vh] `}>
    
   <div style={{background: selectedMovie.backdrop_path ? `url(${imageUrl}${selectedMovie.backdrop_path})` : `url(/img/noWallpaperFound.jpeg)` }} className='h-full cover'>

       <div className='all'>
           {selectedMovie.videos ?
           <>
           
          {selectedMovie.videos && playTrailer ? (
          <>
           <div className='' >
           {renderTrailer()}


            </div>
            <div className='' >
               <h1 className='text-5xl'>{selectedMovie.title}</h1>
                  {selectedMovie.overview ? <p className='my-2 text-xl'>{selectedMovie.overview}</p> : null}
            </div>
            <div className=''>
               {playTrailer && (
                <button className='bg-blue-900 hover:bg-blue-950  font-bold py-2 px-4 border border-blue-900 rounded my-3' onClick={() => {setPlayTrailer(false)}}>
                    Close
                </button>
               )}
            </div>
          </>
         )    : (

    <div className=''>
    <h1 className='text-5xl p-2'>{selectedMovie.title}</h1>
    {selectedMovie.overview ? <p className='my-2 text-xl'>{selectedMovie.overview}</p> : null}
      {!playTrailer && (
    <button onClick={() => setPlayTrailer(true)} className='bg-blue-900 hover:bg-blue-950  font-bold py-2 my-3 px-4 border border-blue-900 rounded '>
    Play Trailer
  </button>
  )}
</div>

  )}
  </>
  :""}
       </div>
      
      </div>  
   </section>
   <main>
   <div className={`grid grid-cols-3 gap-3 bg-black movie ${notFound?"hidden":""}`} onClick={() => window.scrollTo({ top: 5, behavior: 'smooth' })}>
   {movies ?
          MemoMovies( )
      :
      
      <div className='bg-blue-900'>movie not founds</div>}  
   </div>
   </main>
   <footer className='bg-black'>
   {notFound && <div className=' flex flex-row'>
    <p className='title'>no movie found with that name  or it has no trailer</p>
    <button className='bg-blue-900 hover:bg-blue-950  font-bold py-2 px-4 border border-blue-900 rounded mx-3 my-3  text-white w-28 h-10q' onClick={() => window.location.reload()}>refresh</button>
   </div>  }
   
   
   <p className='items-center flex justify-center'><FaCopyright color='#fff' size={30}/><span className='title'>jodos</span></p>
   </footer>

</div>    
)

}
export default App
