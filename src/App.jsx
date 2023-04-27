
    import './App.css'
    import { useState,useEffect } from 'react';
    import Axios from 'axios'
    import { MovieCard } from './components/MovieCard';
    import  YouTube  from 'react-youtube';
    function App() {
      const imageUrl="https://image.tmdb.org/t/p/w1280"
      const[movies,setMovies]=useState([])
      const[selectedMovie,setSelectedMovie]=useState({})
      const [playTrailer,setPlayTrailer]=useState(false)
      const [notFound,setNotFound]=useState(false)
      const apiUrl="https://api.themoviedb.org/3";
      const apiKey="0ef3dd9456aad30104325765e8aa7788"
      const fetchMovies = async (searchKey) => {
        const type = searchKey ? "search" : "discover";
        try {
          const { data } = await Axios.get(`${apiUrl}/${type}/movie`, {
            params: {
              api_key: apiKey,
              query: searchKey,
            },
          });
          setMovies(data.results);
          await selectMovie(data.results[0]);
        } catch (error) {
          console.error(error);
        }
      };
      
      const fetchMovie = async (id) => {
        try {
          const { data } = await Axios.get(`${apiUrl}/movie/${id}`, {
            params: {
              api_key: apiKey,
              append_to_response: "videos",
            },
          });
          return data;
        } catch (error) {
          console.error(error);
        }
      };
      
      async function selectMovie(movie) {
        if(!movie){
          setNotFound(true)
          return;
        }
        try {
          const data = await fetchMovie(movie.id);
          // Now the movie object is loaded, so you can read its properties
          setPlayTrailer(false);
          setSelectedMovie(data);
        } catch (error) {
          console.log(error);
          // handle error here, e.g. show an error message to the user
          setPlayTrailer(false);
          setSelectedMovie(movie);
        }
      }
      

    const renderTrailer = () => {
      try {
        if (selectedMovie && selectedMovie.videos && selectedMovie.videos.results && selectedMovie.videos.results.length > 0) {
          const trailer = selectedMovie.videos.results.find((vid) => vid.name === "Official Trailer");
          const key = trailer ? trailer.key : selectedMovie.videos.results[0].key;
          return (
            <YouTube
              videoId={key}
              containerClassName={"youtubeContainer"}
              className="w-full"
              opts={{
                width: "720px",
                playerVars: {
                  autoplay: true,
                },
              }}
            />
          );
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
              return <MovieCard
              key={movie.id}
              movie={movie}
              selectMovie={selectMovie}
              />
          })
      }
    
      const [searchKey,setSearchKey]=useState("")
      const searching = (e) => {
        const targetValue = e.target.value;
        if (targetValue.includes(" ")) {
          const splited = targetValue.split(" ");
          const joined = splited.join("_");
          setSearchKey(joined);
        } else {
          setSearchKey(targetValue);
        }
      };
      
      const searchMovie=(e)=>{
          e.preventDefault()
          fetchMovies(searchKey)
      }
      

        
      
    
      return(
      

        <div className='container   grid  bg-blue-950  relative  m-0 p-0 div text-slate-300'>
        
        <header className="title grid grid-cols-2 pt-2 flex-row font-bold space-x-64   bg-slate-900   w-full">
        <div className="flex space-x-2 mb-3 ml-3">
          <img src="./img/logo.png" alt="logo image" className="logo w-20 rounded-md"/>
            <h1 className=" text-5xl italic font-serif left-0 mt-4 hover:not-italic">Traileress</h1>
        </div>
        <div className="mt-5 mb-12">
          <form onSubmit={searchMovie} className="absolute right-10">
          <input type="text" name="searchInput" id="seachInput" onChange={searching} className="shadow appearance-none rounded w-80 md:w-60 sm:w-32 py-2 px-3 text-gray-200 bg-blue-900 leading-tight focus:outline-none focus:bg-blue-950 focus:text-gray-200 active:bg-blue-950 active:text-gray-200" />

              <button type="submit" className="ml-6 bg-blue-900 hover:bg-blue-950  font-bold py-2 px-4 border border-blue-900 rounded">Search</button>
          </form>
          </div>
        </header>

       
        <div className={` most ${selectedMovie.videos && playTrailer ? 'md:grid md:grid-cols-2 md:gap-4 md:p-8' : 'flex flex-col items-center justify-center'} md:flex  pb-80  `} style={{background:`url(${imageUrl}${selectedMovie.backdrop_path}) `}}>
        {selectedMovie.videos && playTrailer ? (
            <>
          <div className='trailer ' style={{gridColumn: '1 / 2', gridRow: '1 / 2'}}>
            {renderTrailer()}
          </div>
          <div className='title p-4' style={{gridColumn: '2 / 3', gridRow: '1 / 2'}}>
            <h1 className=' font-serif text-5xl hover:underline '>{selectedMovie.title}</h1>
            {selectedMovie.overview ? <p className='text-xl pt-2'>{selectedMovie.overview}</p> : null}
          </div>
          <div className='actions ' style={{gridColumn: '1 / 3', gridRow: '2 / 3'}}>
            {playTrailer && (
              <button className='close bg-blue-900 hover:bg-blue-950 text-white font-bold py-2 px-4 border border-blue-900 rounded mb-4' onClick={() => {setPlayTrailer(false)}}>
                Close
              </button>
            )}
          </div>
          </>
          )    : (
          <>
            <div className='title p-4'>
                <h1 className='text-3xl font-bold mb-2 '>{selectedMovie.title}</h1>
                {selectedMovie.overview ? <p className='text-lg mb-4'>{selectedMovie.overview}</p> : null}
              {!playTrailer && (
                <button onClick={() => setPlayTrailer(true)} className='bg-blue-900 hover:bg-blue-950  font-bold py-2 px-4 border border-blue-900 rounded'>
                Play Trailer
              </button>
              )}
            </div>
        </>
        )}
        </div>



        <div className=" grid grid-cols-3 gap-4 bg-blue-950 ">
          {movies ?
              renderMovies()
          :
          
          <div className='bg-blue-900'></div>}
        
          
          
        </div>
        {notFound && <p className='text-3xl font-serif m-auto mt-5'>no movie found with that name</p>}
      </div>
        
        
      
        
      )
    
    }

    export default App
