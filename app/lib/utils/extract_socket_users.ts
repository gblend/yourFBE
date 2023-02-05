const extractSocketUsers = async (allActiveSockets: Array<any>) => {
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
