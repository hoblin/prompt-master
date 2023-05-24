# Rakefile

require 'rake'
require 'sequel'

require "sinatra/activerecord"
require "sinatra/activerecord/rake"
namespace :db do
  desc "Transfer data from SQLite to PostgreSQL"
  task :migrate_to_postgres do
    # Connect to your SQLite and PostgreSQL databases
    sqlite_db = Sequel.sqlite('./db/prompt-master.sqlite3')
    pg_db = Sequel.postgres('prompt-master', user: 'postgres', password: 'postgres', host: 'db')

    # Exclude the 'schema_migrations' table
    tables_to_migrate = sqlite_db.tables - %i[schema_migrations ar_internal_metadata]

    # Go through each table in the SQLite database
    tables_to_migrate.each do |table|
      # Copy the data
      sqlite_db[table].each do |row|
        pg_db[table].insert(row)
      end
    end
    # Fix after migration from sqlite to postgres
    %w[categories tags images].each do |table|
      ActiveRecord::Base.connection.reset_pk_sequence!(table)
    end
  end
end
