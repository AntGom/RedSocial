import Publication from "../../models/publicationModel.js";
import { followUserIds } from "../../services/followService.js";

const feed = async (req, res) => {

    try {
        let identity = req.user; // Usuario autenticado
        let page = parseInt(req.params.page) || 1; // Número de página, por defecto 1
        let itemsPerPage = 5; // Número de publicaciones por página

        // Obtener los IDs de los usuarios que sigue
        let followUserId = await followUserIds(identity.id);

        // Si no sigue a nadie, devolver un mensaje
        if (followUserId.following.length === 0) {
            return res.status(200).send({
                status: "success",
                message: `No sigues a nadie, por lo tanto no hay publicaciones en tu feed, ${identity.name}.`
            });
        }

        // Obtener las publicaciones de los usuarios seguidos, paginadas
        const result = await Publication.paginate(
            { user: { $in: followUserId.following } }, // Filtrar por usuarios seguidos
            {
                page: page,
                limit: itemsPerPage,
                populate: [
                    { path: "user", select: "_id name nick image" }, // Información del usuario que publicó
                    { path: "comments.user", select: "_id name nick image" } // Información de los usuarios que comentaron
                ],
                sort: { createdAt: -1 } 
            }
        );

        // Mapear las publicaciones para devolver la info necesaria
        const posts = result.docs.map(post => ({
            _id: post._id,
            text: post.text,
            file: post.file,
            createdAt: post.createdAt,
            user: {
                _id: post.user._id,
                name: post.user.name,
                nick: post.user.nick,
                image: post.user.image 
            },
            comments: post.comments.map(comment => ({
                text: comment.text,
                createdAt: comment.createdAt,
                user: {
                    _id: comment.user._id,
                    name: comment.user.name,
                    nick: comment.user.nick,
                    image: comment.user.image 
                }
            }))
        }));

        return res.status(200).send({
            status: "success",
            page: result.page,
            itemsPerPage: result.limit,
            total: result.totalDocs,
            totalPages: result.totalPages,
            posts
        });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al obtener el feed",
            error: error.message
        });
    }
};

export default feed;
