import express from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllPlaylists, getPlaylistDetails, removeProblemFromPlaylist } from "../controllers/playlist.controller.js";
import { createPlaylistValidator } from "../validator/validator.index.js";

const playlistRoute = express.Router();

playlistRoute.route("/create-playlist").post(createPlaylistValidator(),isLoggedIn,createPlaylist)

playlistRoute.route("/:playlistId/add-problem").post(isLoggedIn,addProblemToPlaylist)

playlistRoute.route("/all-playlists").get(isLoggedIn, getAllPlaylists)

playlistRoute.route("/:playlistId").get(isLoggedIn, getPlaylistDetails)

playlistRoute.route("/:playlistId").delete(isLoggedIn, deletePlaylist)

playlistRoute.route("/:playlistId/remove-problem").delete(isLoggedIn, removeProblemFromPlaylist)

export default playlistRoute;