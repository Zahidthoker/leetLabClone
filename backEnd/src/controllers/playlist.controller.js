import apiError from "../utils/apiError.js";
import {db} from "../libs/db.js"

export const createPlaylist = async (req, res)=>{
    const {name, discription} = req.body;
    const userId = req.user.id;

    try {
        const playlist = await db.playlist.create({
            data:{
                name,
                discription,
                userId
            }
        })

        res.status(200).json({
            success:true,
            message:"Playlist created successfully",
            playlist
        })

    } catch (error) {
        return res.status(501).json(new apiError(501,"Error creating playlist", error))
        
    }

}

export const addProblemToPlaylist = async (req, res)=>{
    const {playlistId} = req.params;
    const {problemIds} = req.body;
    try {
        if(!Array.isArray(problemIds)||problemIds.length===0){
            return res.status(400).json({
                success:false,
                message:"Invalid problem id/id's"
            })
        }
        const problemsInPlaylist = await db.problemInPlaylist.createMany({
            data:problemIds.map((problemId)=>{
              return {
                playListId:playlistId,
                problemId
            }
            })
        })

        return res.status(201).json({
            success:true,
            message:"Problem added to the playlist.",
            problemsInPlaylist
        })
    } catch (error) {
        console.log(error)
        return res.status(501).json(new apiError(501,"Unable to add problem to the palylist", error))
    }
}

export const getAllPlaylists = async (req, res)=>{
    const userId = req.user.id;
    try {
        const playlists = await db.playlist.findMany({
            where:{
                userId,
            },
            include:{
                problems:true
            }
        })
        res.status(201).json({
            success:true,
            message:"All playlists fetched successfully",
            playlists,
        })
    } catch (error) {
        console.log(error)
        return res.status(501).json(new apiError(501,"Unable to to fetch the playlists", error))
    }
}

export const getPlaylistDetails = async (req, res)=>{
    const userId = req.user.id;
    const {playlistId }= req.params;

    try {
        const playlist = await db.playlist.findUnique({
            where:{
                userId,
                id:playlistId
            },
            include:{
                problems:true
            }
        })


        res.status(201).json({
            success:true,
            message:"Problem fetched successfully",
            playlist
        })
    } catch (error) {
        return res.status(501).json(new apiError(501,"Unable to fetch the problem", error))
    }
}

export const deletePlaylist = async (req, res)=>{
    const {playlistId} = req.params
    try {
        const deletedPlaylist = await db.playlist.delete({
            where:{
                id:playlistId
            }
        })

        res.status(200).json({
            success:true,
            message:"Playlist deleted successfully",
            deletedPlaylist
        })
    } catch (error) {
        return res.status(501).json(new apiError(501,"Unable to delete the playlist", error))
    }
}

export const removeProblemFromPlaylist = async (req, res)=>{
    const {problemId} = req.body;
    const {playlistId} = req.params;

    try {
        if(!Array.isArray(problemId) || problemId.length===0){
            return res.status(400).json({
                success:false,
                message:"Invalid problem id"
            })
        }

        const removedProblem = await db.problemInPlaylist.deleteMany({
            where:{
                playListId:playlistId,
                problemId:{
                    in:problemId
                }
            }
        })
        

        return res.status(200).json({
            success:true,
            message:"Problem removed from the playlist successfully",
            removedProblem
        })
    } catch (error) {
        console.log(error)
        return res.status(501).json(new apiError(501,"Unable to remove the problem from the palylist", error))
    }
}