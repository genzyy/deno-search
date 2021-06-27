<div align='center'>
    <h1>Deno Search CLI</h1>
</div>


# What it is?

The repository is about the CLI Tool that I created using deno, typescript and some deno APIs to create a utility which can be used to fetch, replace text in the files of current working directory or any given directory.

# Things Used

- Deno
- Typescript
- Yargs ([here](https://deno.land/x/yargs@v17.0.1-deno/deno.ts))
- Path ([here](https://deno.land/x/yargs@v17.0.1-deno/deno.ts))

# Usage

The package has a pre-built executable to use so that you don't need to install Deno on your machine.

The executable can be used as:
```bash
    $ denoSearch index.ts --text='<word-here>' --extension='<file-extenion>' --replace='<replacing-word-here>'
```

If the executable is placed in the `/` folder then the above command works fine, but if it is not in `/` folder or for example you placed it in the folder in which you want to use the executable then run,

```bash
    $ ./denoSearch index.ts --text='<word-here>' --extension='<file-extenion>' --replace='<replacing-word-here>'
```

## Parameters

- text:
    - The `--text` parameter is used to get the desired word searched from the files in the given directory.

- extension (optional):   
    - The `--extension` parameter is used to only search in the files with the given file extension and leave the other files.

- replace (optional):
    - The `--replace` parameter takes the word which will be replacing the searched word in every file in the given directory.

# Example with Output

```bash
    $ deno run --allow-read index.ts --text='argv'
```

Output:
```bash
    Check file:///home/rishit/Desktop/deno-file-search/index.ts
    /home/rishit/Desktop/deno-file-search/index.ts
    On File: /home/rishit/Desktop/deno-file-search/index.ts, On Line Number => 16  as:
    argv: ArgvReturnType;
    On File: /home/rishit/Desktop/deno-file-search/index.ts, On Line Number => 36  as:
    .demandOption(['text']).argv;
```

* If you don't pass any value to the optional parameters or just don't use them, they will not be used.

```bash
    $ deno run --allow-read --allow-write index.ts --text='readTextFile' --extension=ts --replace='jackWasHere'
```

Output:
```bash
    /home/rishit/Desktop/deno-file-search/index.ts
    On File: /home/rishit/Desktop/deno-file-search/index.ts, On Line Number => 73  as:
     const contents = await Deno.readTextFile(file);
Done!

```

## Notes

* If you want to compile the binary by yourself, clone the repository, install deno, and run:

```bash
    $ deno compile --allow-read --allow-write=. ./index.ts
```

* The flags `--allow-read` and `--allow-write` are used because by default deno env doesn't have read and write permissions. So to enable our tool to read/write the desired files, we provide these permissions.
* And just because we are using private permissions, we don't collect any data, and the files are open source too.