const extractSocketUsers = async (allActiveSockets: any[]) => {
    const activeSocketIds: string[] = [];

    if (allActiveSockets.length) {
        allActiveSockets.forEach((socket) => {
            if (socket.user) activeSocketIds.push(socket.user.id);
        });
    }

   return activeSocketIds.join(',');
}

export {
    extractSocketUsers
}
