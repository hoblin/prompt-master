# Puma configuration file at ./config/puma.rb

# The environment that Puma will run in.
#
# The default is "development".
#
environment ENV.fetch("RACK_ENV") { "development" }

# Specifies the `workers` that Puma will use to serve requests; default is 0.
#
workers ENV.fetch("WEB_CONCURRENCY") { 2 }

# Specifies the `threads` count, if using `workers` > 1; default is 5.
threads ENV.fetch("RAILS_MAX_THREADS") { 5 }, ENV.fetch("RAILS_MAX_THREADS") { 5 }

# Specifies the `port` that Puma will listen on to receive requests; default is 3000.
#
port ENV.fetch("PORT") { 8080 }

# Specifies the `pidfile` that Puma will use.
# pidfile ENV.fetch("PIDFILE") { "tmp/pids/server.pid" }

# Specifies the `state` file that Puma uses to persist a list of worker pid's.
#
# state_path "tmp/pids/puma.state"

# Specifies the `control` socket that Puma uses for cluster control.
#
# control_url "unix://#{ENV.fetch("TMPDIR") { "/tmp" }}/puma.sock"

# Allow puma to be restarted by `rails restart` command.
# plugin :tmp_restart

# Use the `preload_app!` method when specifying a `workers` number.
# This directive tells Puma to first boot the application and load code
# before forking the application. This takes advantage of Copy On Write
# process behavior so workers use less memory.
#
preload_app!
