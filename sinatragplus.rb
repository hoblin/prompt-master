# sinatragplus.rb
require 'sinatra'
require 'google_plus'

error do
  erb :'500'
end

#class
class GPlus
  def initialize(apikey, gid)
    @apikey = apikey
    @gid = gid
    get_info
  end
  attr_reader :row0, :row1, :row2
  private
    #Get info about specific G+ ID
    def get_info
      # GooglePlus.api_key = 'Your API Key'
      begin
        GooglePlus.api_key = @apikey
        person = GooglePlus::Person.get(@gid.to_i)
        @row0 = person.display_name
        @row1 = person.tagline
        @row2 = person.url
      rescue Exception => msg  
        # display the system generated error message  
        puts msg  
      end  
    end
end
 
get '/' do
  erb :index
end

# Display Google+ details
post '/show' do
  @gplus = GPlus.new(params[:apikey], params[:gid])
  erb :show
end
