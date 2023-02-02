# Collection of file utilities
class Utilities
  SYSTEM_FOLDER = "system"

  # Sync DB with ./inspiration folder
  def self.sync_db
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

  # Merge images from ./inspiration/system/category to ./inspiration/category
  # Each ./inspiration/category/**/\d{3}.jpg with the same name belongs to one set. So during merge all the images with the same name should get merged into one set with the same \d{3} name which is available in ./inspiration/category/**/\d{3}.jpg
  def self.merge_images
    # check if system folder have categories to import
    system_categories = Dir["./inspiration/#{SYSTEM_FOLDER}/*"]
    if system_categories.empty?
      logger.info "No categories to merge"
      return
    end
    # collect categories names to merge
    categories = system_categories.map { |category| category.split("/").last }
    categories.each do |category|
      # skip if category name is system
      next if category == SYSTEM_FOLDER
      # find available \d{3} filenames in destination folder
      last_filename = Dir["./inspiration/#{category}/**/*"]
        .map { |file| file.split("/").last }.uniq
        .select { |filename| filename =~ /^\d{3}\.jpg$/ }
        .map { |filename| filename.split(".").first }
        .map(&:to_i).max || -1
      # find all the images with the same name in source folder
      source_files = Dir["./inspiration/#{SYSTEM_FOLDER}/#{category}/**/*"]
        .map { |file| file.split("/").last }.uniq
        .select { |filename| filename =~ /^\d{3}\.jpg$/ }
      # collect tags folder names from source category folder skipping the files
      source_tags = Dir["./inspiration/#{SYSTEM_FOLDER}/#{category}/*"]
        .map { |tag| tag.split("/").last }
        .select { |tag| tag !~ /^\d{3}\.jpg$/ }
      # merge images with the same name
      source_files.each do |source_file|
        last_filename += 1
        # iterate source tags and copy images to destination tags
        source_tags.each do |source_tag|
          # create destination tag directory if not exists
          destination_tag = "./inspiration/#{category}/#{source_tag}"
          FileUtils.mkdir_p(destination_tag) unless File.directory?(destination_tag)
          # copy image to destination tag kmeeping \d{3} with leading zeros
          destination_file = "#{destination_tag}/#{last_filename.to_s.rjust(3, "0")}.jpg"
          FileUtils.cp("./inspiration/#{SYSTEM_FOLDER}/#{category}/#{source_tag}/#{source_file}", destination_file)
          # remove source image
          source_file_path = "./inspiration/#{SYSTEM_FOLDER}/#{category}/#{source_tag}/#{source_file}"
          FileUtils.rm(source_file_path)
          # remove source tag directory if empty
          source_tag_path = "./inspiration/#{SYSTEM_FOLDER}/#{category}/#{source_tag}"
          FileUtils.rm_rf(source_tag_path) if Dir["#{source_tag_path}/*"].empty?
        end
        # remove source category directory if empty
        source_category_path = "./inspiration/#{SYSTEM_FOLDER}/#{category}"
        FileUtils.rm_rf(source_category_path) if Dir["#{source_category_path}/*"].empty?
      end
    end
  end

  def self.logger
    @@logger ||= Logger.new($stdout)
  end
end
