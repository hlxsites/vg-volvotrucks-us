import path from "path";
import {promises as fs} from "fs";

async function moveIndexDocxFiles(dir, moves) {
    try {
        const files = await fs.readdir(dir, { withFileTypes: true });

        for (const file of files) {
            if (file.isDirectory()) {
                const subdir = path.join(dir, file.name);
                await moveIndexDocxFiles(subdir, moves);
                const indexDocxPath = path.join(dir, file.name, 'index.docx');
                const destinationPath = path.join(dir, `${file.name}.docx`);

                try {
                    await fs.access(indexDocxPath);
                    moves.push({ source: indexDocxPath, destination: destinationPath });
                } catch (error) {
                    if (error.code !== 'ENOENT') {
                        console.error(`Error checking ${indexDocxPath}:`, error);
                    }
                }
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
    await moveIndexDocxFiles(directoryPath, moves);

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
