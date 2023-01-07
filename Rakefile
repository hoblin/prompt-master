require "sinatra/activerecord/rake"
namespace :app do
  task :load_config do
    require "./prompt_master"
    # require classes recursively
    Dir[File.dirname(__FILE__) + "/lib/*.rb"].each { |file| require file }
  end

  desc "Sync database with images in inspiration folder"
  task sync: :load_config do
    # create or initialize categories from folders in inspiration folder
    Category.from_directory.each do |category|
      category.save!
      logger.info "\tCategory synced: #{category.name}"

      # create or initialize tags from folders in category folder
      category.tags_from_directory.each do |tag|
        tag.save!
      end
    end
  end

  desc "Merge images from ./inspiration/system/category to ./inspiration/category"
  task merge: :load_config do
    Utilities.merge_images
  end

  def logger
    @logger ||= Logger.new($stdout)
  end
end
