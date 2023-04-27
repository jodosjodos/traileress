export const MovieCard=({movie,selectMovie})=>{

  const moviUrl="https://image.tmdb.org/t/p/w500"
  
  return(
    <div className="movieCard bg-slate-900 flex flex-col rounded-md m-4 max-h-4/6 justify-center items-center" onClick={() => {selectMovie(movie)}}> 
    {movie.poster_path ? <img src={`${moviUrl}${movie.poster_path}`} alt="cover image" className="w-5/6 h-5/6 rounded-2xl"/>
      :
    <div>no image found</div>
    }
    <h5 className="movieTitle ml-7 text-2xl font-bold"> {movie.title}</h5>
  </div>
  
  
  
  )
}