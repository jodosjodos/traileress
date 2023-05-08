export const MovieCard=({movie,selectMovie})=>{
  //props.movie;
  //props.selectMovie;

  const moviUrl="https://image.tmdb.org/t/p/w500"
  
  return(
    <div className="bg-red p-3 text-white text-xl rounded-lg other m-3" onClick={() => {selectMovie(movie)}}> 
    {movie.poster_path ? <img src={`${moviUrl}${movie.poster_path}`} alt="cover image" className="rounded-xl"/>
      :
    <div>no image found</div>
    }
    <h5 className="flex justify-center items-center m-2"> {movie.title}</h5>
  </div>
  
  
  
  )
}