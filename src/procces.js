import { Command } from 'commander'

const program = new Command()

program
    .option('--mode <mode>', 'modo de trabajo del server', 'production')