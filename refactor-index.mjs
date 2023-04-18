import path from "path";
import {existsSync, promises as fs} from "fs";

async function moveIndexDocxFiles(dir, moves, isRoot = false) {
    try {
        const files = await fs.readdir(dir, {withFileTypes: true});
        files.sort((a, b) => a.name.localeCompare(b.name));

        for (const file of files) {
            if (file.isDirectory()) {
                const subdir = path.join(dir, file.name);
                await moveIndexDocxFiles(subdir, moves);
            } else if (file.name === 'index.docx' && !isRoot) {
                const indexDocxPath = path.join(dir, file.name);
                const parentDir = path.dirname(dir);
                const destinationPath = path.join(parentDir, `${path.basename(dir)}.docx`);
                if(existsSync(destinationPath)) {
                    throw new error(`Destination path ${destinationPath} already exists.`);
                }
                moves.push({source: indexDocxPath, destination: destinationPath});
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
    }
}

async function performMoves(moves) {
    for (const move of moves) {
        try {
            await fs.rename(move.source, move.destination);
            console.log(`Moved ${move.source} to ${move.destination}`);
        } catch (error) {
            console.error(`Error moving ${move.source}:`, error);
        }
    }
}

const directoryPath = process.argv[2];
if (!directoryPath) {
    console.error('Please provide a directory path as an argument.');
    process.exit(1);
}

(async () => {
    const moves = [];
    await moveIndexDocxFiles(directoryPath, moves, true);

    console.log('List of moves:');
    for (const move of moves) {
        console.log(`
        Move ${move.source} 
        to   ${move.destination}`);
    }

    // console.log('\nPerforming moves...');
    // await performMoves(moves);
    // console.log('Moves completed.');
})();
